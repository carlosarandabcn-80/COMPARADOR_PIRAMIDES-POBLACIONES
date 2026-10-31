// Datos oficiales municipales publicados por Idescat, fotografía del Censo Anual 2025.
const url='https://www.idescat.cat/serveis/consultes/es/censph_539_mun_2025_pc.csv';
const r=await fetch(url,{signal:AbortSignal.timeout(60000)});
if(!r.ok)throw new Error('Idescat HTTP '+r.status);
const csv=await r.text(),rows=csv.trim().split(/\r?\n/);
const targets={BCN_M:'Barcelona',HOSP_M:"Hospitalet de Llobregat"};
const picks={BCN_M:new Map(),HOSP_M:new Map()};
const seen=new Set();
for(const row of rows.slice(1)){
 const [year,municipio,edad,sexo,concepto,estado,valor]=row.replace(/\r$/,'').split(';');
 if(year!=='2025'||concepto!=='población'||!['hombres','mujeres'].includes(sexo))continue;
 let code=null;
 if(municipio==='Barcelona')code='BCN_M';
 else if(/hospitalet de llobregat/i.test(municipio))code='HOSP_M';
 if(!code)continue;
 const normalized=edad.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
 const quin=normalized.match(/de\s+(\d+)\s+a\s+(\d+)\s+a[nñ]os/);
 const open=normalized.match(/\b(100)\s+(?:anos\s+)?(?:o|y)\s+mas/);
 const start=quin?Number(quin[1]):open?100:null;
 const end=quin?Number(quin[2]):open?120:null;
 if(start===null)continue;
 if(!Number.isSafeInteger(Number(valor))||Number(valor)<0)throw new Error('Valor no válido '+row);
 const key=start+'-'+end,sex=sexo==='hombres'?'m':'f';
 if(!picks[code].has(key))picks[code].set(key,{start,end,m:null,f:null});
 const entry=picks[code].get(key);
 if(entry[sex]!==null)throw new Error('Duplicado '+code+' '+key+' '+sex);
 entry[sex]=Number(valor);seen.add(code);
}
const BANDS=Array.from({length:18},(_,i)=>i===17?'85+':i*5+'–'+(i*5+4));
const dataset={year:2025,source:'Idescat, Censo anual de población, distribución municipal por sexo y edad quinquenal',
 sourceUrl:url,units:'personas',municipalities:{}};
for(const [code,name] of Object.entries(targets)){
 if(!seen.has(code))throw new Error('Municipio no publicado '+name);
 const cohorts=BANDS.map((label,i)=>{
  const start=i*5;
  const entries=i===17?[85,90,95,100].map(x=>picks[code].get(x+'-'+(x===100?120:x+4))):[picks[code].get(start+'-'+(start+4))];
  if(entries.some(v=>!v||!Number.isSafeInteger(v.m)||!Number.isSafeInteger(v.f)))throw new Error('Falta intervalo '+name+' '+label);
  return {label,m:entries.reduce((n,v)=>n+v.m,0),f:entries.reduce((n,v)=>n+v.f,0)};
 });
 const total=cohorts.reduce((n,v)=>n+v.m+v.f,0);
 dataset.municipalities[code]={place:code==='BCN_M'?'Barcelona (municipio)':"L'Hospitalet de Llobregat (municipio)",cohorts,total};
 console.log('MUNICIPIO',code,total);
}
console.log('IDESCAT_JSON_START'+JSON.stringify(dataset)+'IDESCAT_JSON_END');
