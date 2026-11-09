/* Estructura Social · UNIR. Núcleo de pirámides reales, sin fuentes sintéticas. */
import {recognizeMorphology} from './morphology.mjs';
export const BANDS=Object.freeze(Array.from({length:18},(_,i)=>({label:i===17?'85+':i*5+'–'+(i*5+4),start:i*5,end:i===17?null:i*5+4})));
export const INE_TABLE='56934';
const INE_RECENT_TABLE='59583';
const INE_LAST_DEFINITIVE_YEAR=2025;
const fail=s=>{throw new Error(s)};
const decimals=new Intl.NumberFormat('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2});
export const SOURCES={
 eurostat:{name:'Eurostat',table:'demo_pjangroup',label:'Population on 1 January by age group and sex',url:'https://ec.europa.eu/eurostat/databrowser/view/demo_pjangroup/default/table?lang=en'},
 ine:{name:'Instituto Nacional de Estadística',table:'56934',label:'Estadística Continua de Población: población residente por fecha, sexo y edad (desde 1971), ámbito nacional',url:'https://www.ine.es/jaxiT3/Tabla.htm?t=56934'},
  idescat:{name:'Idescat',table:'censph_539_mun_2025_pc',label:'Censo anual de población 2025, municipios por sexo y edad quinquenal',url:'https://www.idescat.cat/dades/obertes/?lang=es'}
};
export const INE_TERRITORIES=Object.freeze({
 ES:{title:'España',table:INE_TABLE,level:'nacional',start:1971,end:2026},
 AN:{title:'Andalucía',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 AR:{title:'Aragón',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 AS:{title:'Asturias',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 IB:{title:'Illes Balears',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 CN:{title:'Canarias',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 CB:{title:'Cantabria',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 CL:{title:'Castilla y León',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 CM:{title:'Castilla-La Mancha',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 CT:{title:'Cataluña',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 VC:{title:'Comunitat Valenciana',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 EX:{title:'Extremadura',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 GA:{title:'Galicia',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 MD:{title:'Madrid (comunidad)',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 MC:{title:'Murcia (región)',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 NC:{title:'Navarra',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 PV:{title:'País Vasco',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 RI:{title:'La Rioja',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 CE:{title:'Ceuta',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 ML:{title:'Melilla',table:'59238',level:'comunidad autónoma',start:2026,end:2026},
 BCN_P:{title:'Barcelona (provincia)',table:'59589',level:'provincia',start:2026,end:2026,filter:'115:9'}
});
export const IDESCAT_TERRITORIES=Object.freeze({
 BCN_M:'Barcelona (municipio)',HOSP_M:"L'Hospitalet de Llobregat (municipio)"
});
export const COUNTRIES={ES:'España',FR:'Francia',DE:'Alemania',IT:'Italia',PT:'Portugal',BE:'Bélgica',NL:'Países Bajos',SE:'Suecia',PL:'Polonia',IE:'Irlanda',EL:'Grecia',AT:'Austria',DK:'Dinamarca',FI:'Finlandia',NO:'Noruega'};
const safe=(v)=>typeof v==='number' && Number.isSafeInteger(v) && v>=0;
export function check(dataset){
 if(!dataset||!Array.isArray(dataset.cohorts)||dataset.cohorts.length!==18)fail('Se requieren dieciocho cohortes quinquenales hasta 85+.');
 if(dataset.meta?.kind!=='oficial'||!['Eurostat','INE','Idescat'].includes(dataset.meta.provider))fail('Solo se admiten series oficiales identificadas.');
 let total=0;
 const cohorts=dataset.cohorts.map((b,i)=>{if(b.label!==BANDS[i].label||!safe(b.m)||!safe(b.f))fail('Edad o recuento inválido en '+BANDS[i].label);total+=b.m+b.f;return {...BANDS[i],m:b.m,f:b.f};});
 if(!Number.isSafeInteger(total)||total<=0)fail('Total poblacional incorrecto.');
 return {cohorts,meta:{...dataset.meta},total};
}
export function indicators(data){
 const d=check(data),sum=(a,b,sex)=>d.cohorts.slice(a,b).reduce((r,c)=>r+(sex?c[sex]:c.m+c.f),0);
 const pct=n=>100*n/d.total;
 const ratio=(a,b)=>b===0?null:a/b;
 const youth=sum(0,3),active=sum(3,13),old=sum(13,18),women=sum(0,18,'f'),men=sum(0,18,'m');
 return {total:d.total,men,women,youth,active,old,pYouth:pct(youth),pOld:pct(old),pActive:pct(active),
 dependency:ratio((youth+old)*100,active),ageing:ratio(old*100,youth),sexRatio:ratio(men*100,women),
 womenOld:ratio(sum(13,18,'f')*100,old)};
}
export function status(a,b){
 if(!a||!b)return {ok:false,message:'Selecciona y carga dos series oficiales.'};
 const x=check(a),y=check(b);
 if(x.meta.kind!=='oficial'||y.meta.kind!=='oficial')return {ok:false,message:'Los modelos didácticos no se mezclan con datos observados.'};
 if(x.meta.unit!==y.meta.unit)return {ok:false,message:'Unidades diferentes: no pueden compararse.'};
 return {ok:true,message:x.meta.provider===y.meta.provider?'Misma fuente. Compara el año y el ámbito geográfico.':'Fuentes distintas. Ambos conjuntos se armonizan por edades y porcentajes; existen posibles diferencias metodológicas entre operaciones estadísticas.'};
}
export function classify(data){
 const d=check(data),r=recognizeMorphology(d.cohorts);
 const explain='Lectura conjunta de base, cuerpo, edades mayores y perfiles de cohortes: '+r.criteria;
 return {type:r.family,explain,ratio:r.ratio,patterns:r.patterns,oldShare:r.oldShare,
 warning:'Clasificación orientativa con umbrales DIDÁCTICOS no estandarizados. Los patrones no identifican por sí mismos fecundidad, migración, mortalidad ni desigualdad social.'};
}
export function describe(d){
 const x=check(d),i=indicators(x),c=classify(x);
 const top=x.cohorts.slice(0,-1).reduce((peak,b)=>b.m+b.f>peak.m+peak.f?b:peak);
 return {title:x.meta.provider+' · '+x.meta.place+' · '+x.meta.year,
 paragraphs:[
  'Esta pirámide representa la población residente por edad y sexo según '+x.meta.provider+' a '+x.meta.referenceDate+'. El total de personas recogidas en los grupos representados es '+i.total.toLocaleString('es-ES')+'.',
  'La población de 0–14 años supone el '+decimals.format(i.pYouth)+' %, la de 15–64 el '+decimals.format(i.pActive)+' % y la de 65 años o más el '+decimals.format(i.pOld)+' %. El tramo quinquenal más numeroso es '+top.label+'.',
  'En términos morfológicos, la distribución es '+c.type.toLowerCase()+'. '+c.explain+' Patrones complementarios: '+(c.patterns.length?c.patterns.map(p=>p.label+' ('+p.evidence+')').join('; '):'sin patrones adicionales destacados por las reglas exploratorias')+'.',
  'La razón de dependencia demográfica total alcanza '+(i.dependency===null?'un valor no calculable':decimals.format(i.dependency)+' personas por cada 100 de 15–64 años')+' y el índice de envejecimiento '+(i.ageing===null?'no es calculable': 'es '+decimals.format(i.ageing)+' personas de 65+ por cada 100 menores de 15')+'.',
  'Esta lectura describe una distribución de efectivos, no acredita por sí sola una causa específica ni permite equiparar dependencia demográfica con dependencia funcional. '+c.warning
 ]};
}
export function compare(a,b){
 const s=status(a,b);if(!s.ok)fail(s.message);
 const x=indicators(a),y=indicators(b);
 const rows=[['Población representada',x.total,y.total,'personas'],['0–14 años',x.pYouth,y.pYouth,'puntos porcentuales'],['15–64 años',x.pActive,y.pActive,'puntos porcentuales'],['65+ años',x.pOld,y.pOld,'puntos porcentuales'],['Índice de envejecimiento',x.ageing,y.ageing,'puntos de índice'],['Dependencia demográfica total',x.dependency,y.dependency,'por cada 100 de 15–64']];
 const content=rows.map(([label,v1,v2,unit])=>({label,a:v1,b:v2,delta:v1===null||v2===null?null:v1-v2,unit}));
 const notes=[s.message,'La comparación proporcional permite contrastar estructuras con tamaños poblacionales diferentes; el tamaño absoluto debe interpretarse por separado.'];
 if(a.meta.year!==b.meta.year)notes.push('Los periodos son distintos: una diferencia transversal no prueba una causa ni describe un flujo migratorio.');
 if(a.meta.provider!==b.meta.provider)notes.push('Comprueba la población de referencia y las posibles revisiones de cada fuente antes de interpretar las diferencias.');
 return {rows:content,notes,description:'La proporción de menores de 15 años es '+decimals.format(x.pYouth)+' % en '+a.meta.place+' ('+a.meta.year+') y '+decimals.format(y.pYouth)+' % en '+b.meta.place+' ('+b.meta.year+'). La proporción de 65 años o más es '+decimals.format(x.pOld)+' % y '+decimals.format(y.pOld)+' %, respectivamente. La diferencia entre el peso de población mayor es de '+decimals.format(x.pOld-y.pOld)+' puntos porcentuales (A menos B). '+notes.join(' ')};
}
export function eurostatURL(geo,year){
 if(!Object.hasOwn(COUNTRIES,geo)||!Number.isInteger(year)||year<1960||year>2025)fail('País o año de Eurostat no permitido.');
 const p=new URLSearchParams({format:'JSON',lang:'EN',geo,time:String(year),freq:'A',unit:'NR'});
 p.append('sex','M');p.append('sex','F');
 return 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_pjangroup?'+p;
}
const categoryIndex=obj=>Array.isArray(obj)?Object.fromEntries(obj.map((x,i)=>[x,i])):obj||{};
/**
 * Fuente: Eurostat, demo_pjangroup. Grupos quinquenales YA publicados por
 * Eurostat. No se suman edades simples incompletas ni se rellenan ausencias.
 * La categoría abierta Y_GE85 incluye todas las edades de 85 o más.
 */
export function fromEurostat(json,geo,year){
 if(!Array.isArray(json?.id)||!Array.isArray(json?.size)||!json.dimension||json.id.length!==json.size.length)fail('Eurostat: respuesta JSON-stat incompatible.');
 for(const id of ['freq','unit','age','sex','geo','time'])if(!json.id.includes(id))fail('Eurostat: falta la dimensión '+id);
 const indices={};for(const id of json.id){
  indices[id]=categoryIndex(json.dimension[id]?.category?.index);
  if(!indices[id] || Object.keys(indices[id]).length===0)fail('Eurostat: dimensión vacía '+id);
 }
 if(!Object.hasOwn(indices.geo,geo)||!Object.hasOwn(indices.time,String(year))||!Object.hasOwn(indices.unit,'NR')||!Object.hasOwn(indices.freq,'A'))fail('Eurostat no ofrece el país/año solicitado en personas.');
 const strides=json.size.map((_,i)=>json.size.slice(i+1).reduce((a,b)=>a*b,1));
 const cell=(age,sex)=>{
  const selected={age,sex,geo,time:String(year),unit:'NR',freq:'A'};
  let pos=0;
  for(let i=0;i<json.id.length;i++){
   const id=json.id[i],v=indices[id][selected[id]];
   if(!Number.isSafeInteger(v)||v<0||v>=json.size[i])return null;
   pos+=v*strides[i];
  }
  const value=json.value?.[pos];return safe(value)?value:null;
 };
 const ageCode=(i)=>i===0?'Y_LT5':i===17?'Y_GE85':'Y'+(i*5)+'-'+(i*5+4);
 const cohorts=BANDS.map((b,i)=>{
  const code=ageCode(i),m=cell(code,'M'),f=cell(code,'F');
  if(m===null||f===null)fail('Eurostat: falta un dato oficial en '+b.label+' ('+[m===null?'hombres':'',f===null?'mujeres':''].filter(Boolean).join(' y ')+') para '+geo+' '+year+'. No se reemplaza por cero ni por cifras simuladas.');
  return {...b,m,f};
 });
 const totalM=cell('TOTAL','M'),totalF=cell('TOTAL','F');
 if(totalM===null||totalF===null)fail('Eurostat: falta el total de uno de los sexos; no se puede conciliar la serie.');
 const sumM=cohorts.reduce((n,b)=>n+b.m,0),sumF=cohorts.reduce((n,b)=>n+b.f,0);
 const unknownM=cell('UNK','M'),unknownF=cell('UNK','F');
 // Cuando falta UNK, solo se acepta coincidencia exacta con el total.
 const expectedM=sumM+(unknownM??0),expectedF=sumF+(unknownF??0);
 if(expectedM!==totalM||expectedF!==totalF)fail('Eurostat: discrepancia entre grupos quinquenales, edades desconocidas y totales publicados ('+geo+' '+year+').');
 const unknown=(unknownM??0)+(unknownF??0);
 const notes=['Cohortes quinquenales oficiales de demo_pjangroup, sin imputación.'];
 if(unknown>0)notes.push('Se excluyen '+unknown+' personas de edad desconocida; los porcentajes se calculan sobre la población de edad conocida.');
 if(json.status && Object.keys(json.status).length)notes.push('La fuente contiene banderas de calidad (revisar estimaciones, provisionalidad y rupturas de serie en Eurostat).');
 return check({meta:{provider:'Eurostat',kind:'oficial',table:'demo_pjangroup',unit:'personas',place:COUNTRIES[geo]||geo,year,referenceDate:year+'-01-01',updatedAt:json.updated||'No indicada',sourceUrl:SOURCES.eurostat.url,apiUrl:eurostatURL(geo,year),note:notes.join(' ')},cohorts});
}
function ineTable(code,year){
 if(!Object.hasOwn(INE_TERRITORIES,code))fail('Territorio del INE no permitido.');
 const territory=INE_TERRITORIES[code];
 if(!Number.isInteger(year)||year<territory.start||year>territory.end)fail('Año del INE fuera del periodo disponible para '+territory.title+'.');
 return code==='ES'&&year>INE_LAST_DEFINITIVE_YEAR?INE_RECENT_TABLE:territory.table;
}

export function ineURL(year){
 return ineTerritoryURL('ES',year);
}

export function ineTerritoryURL(code,year){
 const table=ineTable(code,year),filter=INE_TERRITORIES[code].filter;
 const date=year+'0101';
 // La tabla provincial completa supera el límite de volumen del INE.
 return 'https://servicios.ine.es/wstempus/js/es/DATOS_TABLA/'+table+'?date='+date+':'+date+'&tip=A'+(filter?'&tv='+filter:'');
}

const strip=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();
const GEO_MATCH=Object.freeze({
 ES:/^total nacional$/,
 AN:/\bandalucia\b/,AR:/\baragon\b/,AS:/\basturias\b/,IB:/\bbalears\b|\bbaleares\b/,
 CN:/\bcanarias\b/,CB:/\bcantabria\b/,CL:/\bcastilla y leon\b/,
 CM:/\bcastilla.{0,4}la mancha\b/,CT:/\bcataluna\b|\bcatalunya\b/,
 VC:/\bvalencia\b|\bvalenciana\b/,EX:/\bextremadura\b/,GA:/\bgalicia\b/,
 MD:/\bmadrid\b/,MC:/\bmurcia\b/,NC:/\bnavarra\b/,PV:/\bpais vasco\b|\beuskadi\b/,
 RI:/\brioja\b/,CE:/\bceuta\b/,ML:/\bmelilla\b/,BCN_P:/\bbarcelona\b/
});
export function parseINE(json,year){
 return parseINEAgeSeries(json,'ES',year);
}

export function parseINETerritory(json,code,year){
 if(code==='ES')fail('Ámbito territorial inválido.');
 return parseINEAgeSeries(json,code,year);
}

function parseINEAgeSeries(json,code,year){
 const table=ineTable(code,year),referenceDate=year+'-01-01';
 const terr=INE_TERRITORIES[code];
 if(!Array.isArray(json))fail('El INE no devolvió las series de '+terr.title+'.');
 const rows={m:new Map(),f:new Map(),total:new Map()};
 const sexLabels={m:'hombres',f:'mujeres',total:'ambos sexos'};
 let provisional=false;
 for(const series of json){
  if(typeof series?.Nombre!=='string'||!Array.isArray(series.Data))continue;
  const name=strip(series.Nombre);
  const fields=name.split('.').map(s=>s.trim());
  if(!fields.some(s=>GEO_MATCH[code].test(s))||/nacionalidad|espanola|extranjera|pais de nacimiento/.test(name))continue;
  const isM=fields.some(s=>/^(hombres?|varon(?:es)?)$/.test(s));
  const isF=fields.some(s=>/^mujer(?:es)?$/.test(s));
  if(isM&&isF)continue;
  const sex=isM?'m':isF?'f':'total';
  const allAges=fields.some(s=>s==='todas las edades'||s==='total edades');
  if(sex==='total'&&(!allAges||!fields.includes('total')))continue;
  const age=fields.find(s=>/^(?:de )?(?:\d{1,2} anos?|(?:85|100) y mas anos?)$/.test(s));
  if(!allAges&&!age)continue;
  const key=allAges?'total':parseInt(age.replace(/^de /,''),10)+(age.includes('y mas')?'+':'');
  for(const record of series.Data){
   if(!safe(record?.Valor))continue;
   // La fecha local publicada distingue enero de otros cortes del mismo año.
   const matches=record.Fecha==null
    ? Number(record.Anyo??record.Año)===year&&(!record.T3_Periodo||strip(record.T3_Periodo)==='1 de enero de')
    : typeof record.Fecha==='string'&&record.Fecha.split('T')[0]===referenceDate;
   if(!matches)continue;
   if(rows[sex].has(key))fail('Serie INE duplicada para '+terr.title+', '+key+' ('+sexLabels[sex]+').');
   rows[sex].set(key,record.Valor);
   if(strip(record.T3_TipoDato)==='provisional')provisional=true;
  }
 }
 const required=(sex,age)=>{
  const value=rows[sex].get(String(age));
  if(value===undefined)fail('En el INE falta edad '+age+' ('+sexLabels[sex]+') para '+terr.title+' '+year+'.');
  return value;
 };
 const sumBand=(sex,band)=>{
  const open=band.end===null;
  if(open&&rows[sex].has('85+'))return rows[sex].get('85+');
  let sum=open?required(sex,'100+'):0;
  for(let age=band.start;age<=(band.end??99);age++)sum+=required(sex,age);
  return sum;
 };
 const cohorts=BANDS.map(b=>({...b,m:sumBand('m',b),f:sumBand('f',b)}));
 const men=cohorts.reduce((sum,b)=>sum+b.m,0),women=cohorts.reduce((sum,b)=>sum+b.f,0);
 const total=men+women;
 const publishedMen=rows.m.get('total'),publishedWomen=rows.f.get('total');
 const publishedTotal=rows.total.get('total')??
  (publishedMen!==undefined&&publishedWomen!==undefined?publishedMen+publishedWomen:undefined);
 if(publishedTotal===undefined)fail('Falta el total publicado por el INE para comprobar la serie.');
 const totals=[[men,publishedMen,'hombres'],[women,publishedWomen,'mujeres'],[total,publishedTotal,'ambos sexos']];
 const differences=[];
 for(const [observed,published,label] of totals){
  if(published===undefined)continue;
  const delta=observed-published;
  // Las cifras históricas se publican como enteros y pueden discrepar al sumar las edades.
  if(Math.abs(delta)>Math.max(5,Math.ceil(published/1000000)))fail('El total de '+label+' difiere del publicado por el INE para '+terr.title+' '+year+'.');
  if(delta!==0)differences.push(label+' '+(delta>0?'+':'')+delta);
 }
 const notes=['Estadística Continua de Población, '+terr.level+', a 1 de enero.'];
 if(provisional)notes.push('Cifras provisionales del INE, sujetas a revisión.');
 if(rows.m.has('85+')&&rows.f.has('85+'))notes.push('Grupo de 85 años y más publicado directamente por el INE.');
 if(differences.length)notes.push('Total de referencia del INE de '+publishedTotal.toLocaleString('es-ES')+' personas. Diferencias al sumar las edades ('+differences.join(', ')+'). Los porcentajes usan la suma de los grupos representados.');
 return check({cohorts,meta:{provider:'INE',kind:'oficial',unit:'personas',table,place:terr.title,year,referenceDate,
  updatedAt:'Consultar ficha INE',sourceUrl:'https://www.ine.es/jaxiT3/Tabla.htm?t='+table,apiUrl:ineTerritoryURL(code,year),
  publishedTotal,provisional,note:notes.join(' ')}});
}


/** Fotografía municipal oficial del Idescat, basada en el Censo Anual 2025.
 * Se distribuye con el proyecto para evitar bloqueos CORS del archivo CSV original.
 */
export function parseIdescatSnapshot(json,code,year){
 if(year!==2025||!Object.hasOwn(IDESCAT_TERRITORIES,code)||json?.year!==2025||
  !json?.sourceUrl?.startsWith('https://www.idescat.cat/'))fail('Idescat: metadatos de origen o periodo no válidos.');
 const source=json.municipalities?.[code];
 if(!source||!Array.isArray(source.cohorts)||source.cohorts.length!==18)fail('Idescat: datos municipales incompletos');
 const data=check({cohorts:source.cohorts.map((v,i)=>({...BANDS[i],m:v.m,f:v.f,label:v.label})),
  meta:{provider:'Idescat',kind:'oficial',unit:'personas',table:'censph_539_mun_2025_pc',
   place:IDESCAT_TERRITORIES[code],year,referenceDate:'2025-01-01',
   updatedAt:'Publicado por Idescat en 2025',sourceUrl:json.sourceUrl,
   note:'Instantánea local de datos oficiales municipales publicada por Idescat; no consulta de API en tiempo real. Agrupación de los intervalos 85–89, 90–94, 95–99 y 100+ en 85+. Origen: Censo anual del INE difundido por Idescat.'}});
 if(data.total!==source.total)fail('Idescat: el total no concilia con la suma de cohortes.');
 return data;
}

export function serializeCSV(dataset){
 const d=check(dataset);return 'edad;hombres;mujeres\n'+d.cohorts.map(c=>[c.label,c.m,c.f].join(';')).join('\n')+'\n';
}
export function serializeJSON(dataset){return JSON.stringify(check(dataset),null,2);}
