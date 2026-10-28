/* Estructura Social · UNIR. Núcleo de pirámides reales, sin fuentes sintéticas. */
export const BANDS=Object.freeze(Array.from({length:18},(_,i)=>({label:i===17?'85+':i*5+'–'+(i*5+4),start:i*5,end:i===17?null:i*5+4})));
const fail=s=>{throw new Error(s)};
export const SOURCES={
 eurostat:{name:'Eurostat',table:'demo_pjan',label:'Population on 1 January by age and sex',url:'https://ec.europa.eu/eurostat/databrowser/view/demo_pjan/default/table?lang=en'},
 ine:{name:'Instituto Nacional de Estadística',table:'56934',label:'Estadística Continua de Población: población residente por fecha, sexo y edad (desde 1971), ámbito nacional',url:'https://www.ine.es/jaxiT3/Tabla.htm?t=56934'}
};
export const COUNTRIES={ES:'España',FR:'Francia',DE:'Alemania',IT:'Italia',PT:'Portugal',BE:'Bélgica',NL:'Países Bajos',SE:'Suecia',PL:'Polonia',IE:'Irlanda',GR:'Grecia',AT:'Austria',DK:'Dinamarca',FI:'Finlandia',NO:'Noruega'};
const safe=(v)=>typeof v==='number' && Number.isSafeInteger(v) && v>=0;
export function check(dataset){
 if(!dataset||!Array.isArray(dataset.cohorts)||dataset.cohorts.length!==18)fail('Se requieren dieciocho cohortes quinquenales hasta 85+.');
 if(dataset.meta?.kind!=='oficial'||!['Eurostat','INE'].includes(dataset.meta.provider))fail('Solo se admiten series oficiales identificadas.');
 let total=0;
 const cohorts=dataset.cohorts.map((b,i)=>{if(b.label!==BANDS[i].label||!safe(b.m)||!safe(b.f))fail('Edad o recuento inválido en '+BANDS[i].label);total+=b.m+b.f;return {...BANDS[i],m:b.m,f:b.f};});
 if(!Number.isSafeInteger(total)||total<=0)fail('Total poblacional incorrecto.');
 return {cohorts,meta:{...dataset.meta},total};
}
export function indicators(data){
 const d=check(data),sum=(a,b,sex)=>d.cohorts.slice(a,b).reduce((r,c)=>r+(sex?c[sex]:c.m+c.f),0);
 const pct=n=>Math.round(n/d.total*1e6)/1e4;
 const ratio=(a,b)=>b===0?null:Math.round(a/b*1e4)/1e4;
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
 const d=check(data),i=indicators(d),slice=(a,b)=>d.cohorts.slice(a,b).reduce((n,c)=>n+c.m+c.f,0);
 const younger=slice(0,3)/3,adults=slice(6,9)/3,senior=i.old;
 const ratio=adults>0?younger/adults:null;
 let type='Mixta o de transición',explain='La relación entre la base y las cohortes adultas no se ajusta de forma clara a un único esquema tipológico.';
 if(ratio!==null && ratio>=1.25 && i.pOld<15){type='Compatible con expansiva';explain='La base presenta, en promedio, más efectivos que los grupos de 30–44 años; el peso de 65+ es relativamente reducido.';}
 else if(ratio!==null && ratio<=.8){type='Compatible con regresiva';explain='La base presenta menos efectivos que las edades de 30–44 años; puede coexistir con un aumento relativo de edades mayores.';}
 else if(ratio!==null && ratio>.8 && ratio<1.25){type='Compatible con estacionaria o de transición';explain='El volumen medio de la base se aproxima al de las cohortes adultas seleccionadas.';}
 return {type,explain,ratio,warning:'Clasificación meramente orientativa basada en umbrales DIDÁCTICOS no estandarizados (base 0–14 frente a 30–44 y peso de 65+). La forma no demuestra causas de fecundidad, migraciones o mortalidad.'};
}
export function describe(d){
 const x=check(d),i=indicators(x),c=classify(x);
 const top=x.cohorts.map(b=>({label:b.label,n:b.m+b.f})).sort((a,b)=>b.n-a.n)[0];
 return {title:x.meta.provider+' · '+x.meta.place+' · '+x.meta.year,
 paragraphs:[
  'Esta pirámide representa la población residente por edad y sexo según '+x.meta.provider+' a '+x.meta.referenceDate+'. El total de personas recogidas en los grupos representados es '+i.total.toLocaleString('es-ES')+'.',
  'La población de 0–14 años supone el '+i.pYouth.toFixed(2)+' %, la de 15–64 el '+i.pActive.toFixed(2)+' % y la de 65 años o más el '+i.pOld.toFixed(2)+' %. El tramo quinquenal más numeroso es '+top.label+'.',
  'En términos morfológicos, la distribución es '+c.type.toLowerCase()+'. '+c.explain,
  'La razón de dependencia demográfica total alcanza '+(i.dependency===null?'un valor no calculable':i.dependency.toFixed(2)+' personas por cada 100 de 15–64 años')+' y el índice de envejecimiento '+(i.ageing===null?'no es calculable': 'es '+i.ageing.toFixed(2)+' personas de 65+ por cada 100 menores de 15')+'.',
  'Esta lectura describe una distribución de efectivos, no acredita por sí sola una causa específica ni permite equiparar dependencia demográfica con dependencia funcional. '+c.warning
 ]};
}
export function compare(a,b){
 const s=status(a,b);if(!s.ok)fail(s.message);
 const x=indicators(a),y=indicators(b),delta=(a,b)=>Math.round((a-b)*1e4)/1e4;
 const rows=[['Población total',x.total,y.total,'personas'],['0–14 años',x.pYouth,y.pYouth,'puntos porcentuales'],['15–64 años',x.pActive,y.pActive,'puntos porcentuales'],['65+ años',x.pOld,y.pOld,'puntos porcentuales'],['Índice de envejecimiento',x.ageing,y.ageing,'puntos de índice'],['Dependencia demográfica total',x.dependency,y.dependency,'por cada 100 de 15–64']];
 const content=rows.map(([label,v1,v2,unit])=>({label,a:v1,b:v2,delta:v1===null||v2===null?null:delta(v1,v2),unit}));
 const notes=[s.message,'La comparación proporcional permite contrastar estructuras con tamaños poblacionales diferentes; el tamaño absoluto debe interpretarse por separado.'];
 if(a.meta.year!==b.meta.year)notes.push('Los periodos son distintos: una diferencia transversal no prueba una causa ni describe un flujo migratorio.');
 if(a.meta.provider!==b.meta.provider)notes.push('Atención a la población de referencia y posibles revisiones del INE y Eurostat: diferencias no son automáticamente errores.');
 return {rows:content,notes,description:'La proporción de menores de 15 años es '+x.pYouth.toFixed(2)+' % en '+a.meta.place+' ('+a.meta.year+') y '+y.pYouth.toFixed(2)+' % en '+b.meta.place+' ('+b.meta.year+'). La proporción de 65 años o más es '+x.pOld.toFixed(2)+' % y '+y.pOld.toFixed(2)+' %, respectivamente. La diferencia entre el peso de población mayor es de '+delta(x.pOld,y.pOld).toFixed(2)+' puntos porcentuales (A menos B). '+notes.join(' ')};
}
export function eurostatURL(geo,year){
 if(!Object.hasOwn(COUNTRIES,geo)||!Number.isInteger(year)||year<1960||year>2026)fail('País o año de Eurostat no permitido.');
 const p=new URLSearchParams({format:'JSON',lang:'EN',geo,time:String(year),freq:'A',unit:'NR'});
 p.append('sex','M');p.append('sex','F');
 return 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_pjan?'+p;
}
const categoryIndex=obj=>Array.isArray(obj)?Object.fromEntries(obj.map((x,i)=>[x,i])):obj||{};
export function fromEurostat(json,geo,year){
 if(!Array.isArray(json?.id)||!Array.isArray(json?.size)||!json.dimension)fail('Eurostat no devolvió un objeto JSON-stat compatible.');
 for(const id of ['age','sex','geo','time','unit'])if(!json.id.includes(id))fail('Eurostat: falta la dimensión '+id);
 const indices={};for(const id of json.id)indices[id]=categoryIndex(json.dimension[id]?.category?.index);
 if(!Object.hasOwn(indices.geo,geo)||!Object.hasOwn(indices.time,String(year)))fail('Eurostat no ofrece esa selección.');
 const strides=json.size.map((_,i)=>json.size.slice(i+1).reduce((a,b)=>a*b,1));
 const cell=(age,sex)=>{if(!Object.hasOwn(indices.age,age)||!Object.hasOwn(indices.sex,sex))return null;
  const selected={age,sex,geo,time:String(year),unit:'NR',freq:'A'};
  let pos=0;for(let i=0;i<json.id.length;i++){const v=indices[json.id[i]][selected[json.id[i]]];if(v===undefined)return null;pos+=v*strides[i];}
  const n=json.value?.[pos];return safe(n)?n:null;
 };
 const cohorts=BANDS.map((b,i)=>{
  const calc=sex=>{let sum=0;for(let age=b.start;age<=(i===17?99:b.end);age++){const n=cell(age===0?'Y_LT1':'Y'+age,sex);if(n===null)fail('Eurostat: falta el valor '+age+' ('+sex+').');sum+=n;}
   if(i===17){const n=cell('Y_OPEN',sex);if(n===null)fail('Eurostat: falta la clase abierta 100+ (Y_OPEN).');sum+=n;}
   return sum;};
  return {...b,m:calc('M'),f:calc('F')};
 });
 const unknown=(cell('UNK','M')??0)+(cell('UNK','F')??0);
 const aggregate=cohorts.reduce((n,c)=>n+c.m+c.f,0),overall=cell('TOTAL','M')+cell('TOTAL','F');
 if(Number.isFinite(overall)&&overall!==aggregate+unknown)fail('No coincide el desglose con el total Eurostat.');
 return check({meta:{provider:'Eurostat',kind:'oficial',unit:'personas',place:COUNTRIES[geo]||geo,year,referenceDate:year+'-01-01',updatedAt:json.updated||'No indicada',sourceUrl:SOURCES.eurostat.url,apiUrl:eurostatURL(geo,year),note:unknown?'Se excluyen '+unknown+' personas de edad desconocida.':'Se incluye toda la población con edad conocida.'},cohorts});
}
export const INE_TABLE='56934';
export function ineURL(year){
 if(!Number.isInteger(year)||year<1971||year>2026)fail('Año INE fuera del periodo permitido.');
 return 'https://servicios.ine.es/wstempus/js/es/DATOS_TABLA/'+INE_TABLE+'?date='+year+'0101:'+year+'0101&tip=A';
}
export function parseINE(json,year){
 if(!Array.isArray(json))fail('La respuesta del INE no contiene series de datos.');
 const rows={m:new Map(),f:new Map()};
 for(const series of json){
   if(typeof series?.Nombre!=='string'||!Array.isArray(series.Data))continue;
   const name=series.Nombre.replace(/\s+/g,' ').trim(),norm=name.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
   // El formato de las series debe indicar el sexo inequívocamente y no mezclar territorios o nacionalidades.
   const isM=/\bhombres?\b|\bvarones?\b/.test(norm),isF=/\bmujeres?\b/.test(norm);
   if(isM===isF)continue;
   if(/espanola|extranjera|nacionalidad|comunidad|provincia/.test(norm))continue;
   const age=norm.match(/(?:^|[ ,.:;])(\d{1,3})\s*anos?(?:\b|$)/);
   const open=norm.match(/(?:^|[ ,.:;])(\d{1,3})\s*y\s*mas(?:\b|$)/);
   if(!age&&!open)continue;
   // INE publica también un subtotal 100+ además de 100,101…104 y 105+.
   // Excluimos el subtotal 100+ para impedir duplicaciones.
   if(open&&Number(open[1])!==105)continue;
   const a=open?105:Number(age[1]);if(a>105)continue;
   const record=series.Data.find(item=>{const d=String(item?.Anyo??item?.Año??item?.NombrePeriodo??'');return d===String(year)||d.includes(String(year));});
   if(!record||!safe(record.Valor))continue;
   const target=isM?rows.m:rows.f;
   if(target.has(a))fail('INE: registros duplicados para la edad '+a+'. No se puede atribuir una sola serie.');
   target.set(a,record.Valor);
 }
 const cohorts=BANDS.map((b,i)=>{
   const get=sex=>{let out=0;for(let age=b.start;age<=(i===17?105:b.end);age++){const v=rows[sex].get(age);if(!safe(v))fail('INE: falta edad '+age+' ('+sex+'). La estructura del API puede haber cambiado.');out+=v;}return out;};
   return {...b,m:get('m'),f:get('f')};
 });
 const total=cohorts.reduce((sum,b)=>sum+b.m+b.f,0);
 const officialTotal=json.find(s=>/total nacional\. todas las edades\. total\./i.test(s.Nombre||''))?.Data?.find(x=>x.Anyo===year)?.Valor;
 if(safe(officialTotal)&&total!==officialTotal)fail('INE: las edades suman '+total+' pero el total publicado es '+officialTotal+'. Se rechaza el desglose.');
 return check({meta:{provider:'INE',kind:'oficial',unit:'personas',place:'España',year,referenceDate:year+'-01-01',updatedAt:'Consultar ficha INE',sourceUrl:SOURCES.ine.url,apiUrl:ineURL(year),note:'Estadística Continua de Población (cifras a 1 de enero). Comprueba las series, la continuidad metodológica desde 1971 y las revisiones en la ficha oficial.'},cohorts});
}
export function serializeCSV(dataset){
 const d=check(dataset);return 'edad;hombres;mujeres\n'+d.cohorts.map(c=>[c.label,c.m,c.f].join(';')).join('\n')+'\n';
}
export function serializeJSON(dataset){return JSON.stringify(check(dataset),null,2);}
