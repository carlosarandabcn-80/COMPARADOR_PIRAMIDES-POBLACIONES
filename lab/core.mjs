/* Núcleo demográfico sin dependencias ni DOM. Licencia de código: MIT (véase LICENSE). */
export const AGE_BANDS = Object.freeze(Array.from({length: 18}, (_,i)=>({
  label:i===17?'85+':(i*5)+'-'+(i*5+4), start:i*5,end:i===17?null:i*5+4
})));
export const MODES = Object.freeze({
  joven:{name:'Estructura juvenil (modelo didáctico)',m:[91,86,81,77,73,69,65,61,57,53,49,45,41,37,33,29,25,26],f:[88,83,78,75,72,68,64,61,59,56,52,49,45,41,37,34,30,38]},
  envejecida:{name:'Estructura envejecida (modelo didáctico)',m:[32,35,37,40,43,47,52,57,63,69,74,78,81,77,69,58,43,45],f:[31,34,36,40,45,50,56,62,68,74,80,86,91,91,88,79,69,105]},
  transicion:{name:'Transición demográfica (modelo didáctico)',m:[49,52,54,59,65,72,78,85,91,95,91,85,77,67,55,43,30,30],f:[47,50,53,57,65,72,80,88,94,99,95,89,81,72,61,49,37,45]},
  muesca:{name:'Muesca generacional (modelo didáctico)',m:[71,72,73,74,76,78,80,36,79,81,82,79,73,64,51,40,28,27],f:[69,70,71,72,75,78,82,38,83,85,86,84,79,72,62,52,39,51]}
});
function error(message){throw new Error(message)}
export function synthetic(key){
  const model=MODES[key]; if(!model)error('Modelo sintético inexistente.');
  const cohorts=AGE_BANDS.map((b,i)=>({...b,m:model.m[i],f:model.f[i]}));
  return validateDataset({meta:{id:key,name:model.name,kind:'sintetico',source:'Modelo didáctico construido para esta herramienta; NO datos observados',referenceDate:'Sin año real',updatedAt:'2026-10-28',unit:'unidades ficticias',ageGroups:'Quinquenales hasta 84; 85 años o más',limitations:'Valores arbitrarios para practicar; no permiten atribuciones a territorios o poblaciones reales.'},cohorts});
}
export function validateDataset(data){
  if(!data || !Array.isArray(data.cohorts) || data.cohorts.length!==AGE_BANDS.length)error('Se necesitan exactamente 18 grupos de edad consecutivos (0-4, …, 85+).');
  const meta=data.meta;
  if(!meta || typeof meta.name!=='string' || !meta.name.trim())error('Indica un título para el conjunto de datos.');
  const groups=data.cohorts.map((c,i)=>{
    const b=AGE_BANDS[i];
    if(c.label!==b.label)error('Grupo '+(i+1)+' incorrecto: se esperaba '+b.label+'.');
    for(const s of ['m','f']){
      if(typeof c[s]!=='number'|| !Number.isSafeInteger(c[s]) ||c[s]<0)error('Población inválida en '+b.label+' ('+s+'). Se requieren enteros no negativos seguros.');
    }
    return {...b,m:c.m,f:c.f};
  });
  const totals=groups.reduce((a,c)=>a+c.m+c.f,0);
  if(!Number.isSafeInteger(totals)||totals<=0)error('La población total debe ser positiva y representable con precisión.');
  return {meta:{id:String(meta.id??'personalizado').slice(0,120),name:meta.name.trim().slice(0,180),
    kind: ['sintetico','oficial','aportado'].includes(meta.kind)?meta.kind:'aportado',
    source:String(meta.source??'Origen no comprobado').slice(0,300),
    sourceUrl:String(meta.sourceUrl??'').slice(0,600),
    referenceDate:String(meta.referenceDate??'No indicada').slice(0,80),
    updatedAt:String(meta.updatedAt??'No indicada').slice(0,80),
    unit:String(meta.unit??'personas').slice(0,80),
    ageGroups:'Quinquenales hasta 84; 85 años o más',
    limitations:String(meta.limitations??'No consta verificación independiente de procedencia.').slice(0,400)
  },cohorts:groups};
}
const div=(a,b)=>b===0?null:a/b;
const round=(x)=>x===null?null:Math.round((x+Number.EPSILON)*10000)/10000;
export function indicators(dataset){
  const d=validateDataset(dataset);
  const sum=(from,to)=>d.cohorts.slice(from,to).reduce((a,c)=>a+c.m+c.f,0);
  const total=sum(0,18),men=d.cohorts.reduce((a,c)=>a+c.m,0),women=total-men,
    youth=sum(0,3),working=sum(3,13),old=sum(13,18);
  return {total,men,women,youth,working,old,
    youthPct:round(100*youth/total),oldPct:round(100*old/total),
    youthDependency:round(div(100*youth,working)),
    oldDependency:round(div(100*old,working)),
    totalDependency:round(div(100*(youth+old),working)),
    ageingIndex:round(div(100*old,youth)),
    maleToFemale:round(div(100*men,women)),
    womenInOld:round(div(100*d.cohorts.slice(13).reduce((a,c)=>a+c.f,0),old))
  };
}
export function comparable(a,b){
  const x=validateDataset(a),y=validateDataset(b);
  if(x.meta.kind==='sintetico'||y.meta.kind==='sintetico')return {valid:true,warning:'Comparación exclusivamente didáctica: incluye al menos un modelo sintético; nunca se interpreta como realidad territorial.'};
  if(x.meta.unit!==y.meta.unit)return {valid:false,warning:'Unidades incompatibles; no se deben comparar estos conjuntos.'};
  return {valid:true,warning:'Las definiciones quinquenales coinciden. Comprueba diferencias en fecha de referencia, cobertura, población y metodología.'};
}
export function trace(dataset,other=null){
  const d=validateDataset(dataset),i=indicators(d),lines=[];
  const add=(id,observation,reading,hypothesis,verify,conditioned,limit)=>lines.push({id,observation,reading,hypothesis,verify,conditioned,limit});
  add('R01',i.oldPct+' % de personas de 65 años o más.', 'Describe el peso relativo de un tramo de edad en este conjunto.',
    'Una estructura más envejecida puede resultar de diferentes combinaciones de fecundidad, supervivencia y migración.',
    'Investigar accesibilidad de servicios, autonomía, preferencias y recursos comunitarios con indicadores específicos y participación.',
    'Si una evaluación participativa confirma barreras de acceso, codiseñar apoyos comunitarios y medir su utilización y resultados.',
    'El porcentaje no mide dependencia funcional, soledad ni necesidades individuales.');
  add('R02',i.youthPct+' % de menores de 15 años.', 'Describe la presencia relativa de población infantil.',
    'Su tamaño y evolución pueden asociarse a cambios demográficos distintos.',
    'Contrastar matriculación, oferta educativa, movilidad, renta y demandas expresadas por familias y jóvenes.',
    'Si se constatan barreras, codiseñar actividades educativas inclusivas y evaluar cobertura, participación y satisfacción.',
    'Una base amplia no prueba déficit escolar ni vulnerabilidad.');
  if(i.totalDependency!==null)add('R03','Razón de dependencia demográfica total: '+i.totalDependency+' por 100 personas de 15–64 años.',
    'Relación entre grupos etarios convencionales; no cuenta personas económicamente dependientes.',
    'El cambio de la estructura por edades modifica esta razón aunque no cambien los servicios ni la situación laboral.',
    'Consultar actividad, empleo, prestaciones, cuidados y necesidades identificadas en el territorio.',
    'Solo con diagnóstico complementario, planificar recursos y definir indicadores de proceso y resultado.',
    'Las personas de 15–64 no son necesariamente activas, y las demás no son necesariamente dependientes.');
  if(other){
    const comparison=comparable(d,other);
    if(comparison.valid){
      const j=indicators(other);const diff=round(i.oldPct-j.oldPct);
      add('R04','Diferencia de peso de 65+: '+diff+' puntos porcentuales respecto a '+other.meta.name+'.',
        'Comparación de proporciones, no de números absolutos.',
        'Las diferencias pueden vincularse a múltiples trayectorias históricas.',
        'Revisar fechas de referencia, migración, cobertura estadística y series homogéneas.',
        'Antes de intervenir, contrastar recursos y necesidades manifestadas en cada territorio.',
        'Comparar modelos sintéticos con datos reales no demuestra diferencias territoriales.');
    }
  }
  return lines;
}
export function parseCSV(raw,name='Archivo CSV del usuario'){
  const text=String(raw).replace(/^\uFEFF/,'').trim();if(text.length>1000000)error('CSV demasiado grande.');
  const lines=text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  const separator=lines[0]?.includes(';')?';':',';
  const headers=lines.shift()?.toLowerCase().split(separator).map(x=>x.trim().replace(/^"|"$/g,''));
  if(!headers||headers.join('|')!=='edad|hombres|mujeres')error('Cabecera obligatoria: edad,hombres,mujeres (se admite ; como separador).');
  const cohorts=lines.map(line=>{
    const cells=line.split(separator).map(s=>s.trim().replace(/^"|"$/g,''));
    if(cells.length!==3||!/^\d+$/.test(cells[1])||!/^\d+$/.test(cells[2]))error('Fila CSV inválida: '+line.slice(0,80));
    return {label:cells[0],m:Number(cells[1]),f:Number(cells[2])};
  });
  return validateDataset({meta:{name,kind:'aportado',source:'Archivo CSV aportado por el usuario. Procedencia estadística no verificada.',unit:'personas',limitations:'No se ha validado externamente la representatividad ni las fuentes del CSV.'},cohorts});
}
export function parseJSON(raw){
  if(String(raw).length>1000000)error('JSON demasiado grande.');
  let obj;try{obj=JSON.parse(raw)}catch{error('El archivo no es un JSON válido.')}
  if(obj?.meta)obj.meta.kind='aportado'; // Los archivos del usuario no se certifican como oficiales.
  return validateDataset(obj);
}
export function toCSV(dataset){
  const d=validateDataset(dataset);
  return 'edad,hombres,mujeres\n'+d.cohorts.map(c=>[c.label,c.m,c.f].join(',')).join('\n')+'\n';
}
export function toJSON(dataset){return JSON.stringify(validateDataset(dataset),null,2);}
export function eurostatURL(geo,year){
  if(!/^[A-Z]{2}$/.test(geo)||!Number.isInteger(year)||year<1960||year>2025)error('Código de país o año no admitido.');
  const p=new URLSearchParams({format:'JSON',lang:'EN',geo,time:String(year),freq:'A',unit:'NR'});
  p.append('sex','M');p.append('sex','F');
  return 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_pjan?'+p.toString();
}
function categoryIndex(obj){
  if(Array.isArray(obj))return Object.fromEntries(obj.map((x,i)=>[x,i]));
  if(typeof obj==='object'&&obj!==null)return obj;
  error('Categorías JSON-stat no reconocidas.');
}
export function parseEurostat(json,geo,year){
  if(!json||!Array.isArray(json.id)||!Array.isArray(json.size)||!json.dimension)error('Respuesta Eurostat JSON-stat inválida.');
  const expected=['age','sex','geo','time','unit'];
  for(const id of expected)if(!json.id.includes(id))error('Falta la dimensión Eurostat: '+id);
  const ix={};for(const id of json.id)ix[id]=categoryIndex(json.dimension[id]?.category?.index);
  if(!Object.hasOwn(ix.geo,geo)||!Object.hasOwn(ix.time,String(year))||!Object.hasOwn(ix.unit,'NR'))error('La respuesta no contiene país, año y unidad solicitados.');
  const strides=json.size.map((_,i)=>json.size.slice(i+1).reduce((a,b)=>a*b,1));
  const cell=(age,sex)=>{
    if(!Object.hasOwn(ix.age,age)||!Object.hasOwn(ix.sex,sex))return null;
    const choices={age,sex,geo,time:String(year),unit:'NR',freq:'A'},pos=json.id.reduce((a,id,k)=>a+(ix[id][choices[id]]??0)*strides[k],0);
    const n=json.value?.[pos];return typeof n==='number' &&Number.isSafeInteger(n)&&n>=0?n:null;
  };
  const cohorts=AGE_BANDS.map((band,i)=>{
    const first=i*5,last=i===17?99:first+4;
    const read=sex=>{
      let t=0;
      for(let a=first;a<=last;a++){const v=cell('Y'+a,sex);if(v===null)error('Eurostat carece de edad '+a+' para '+sex+'; no se imputan valores faltantes.');t+=v;}
      if(i===17){const v=cell('Y_GE100',sex);if(v===null)error('No se ha encontrado 100+ en Eurostat; se evita truncar 85+.');t+=v;}
      return t;
    };
    return {...band,m:read('M'),f:read('F')};
  });
  const names={ES:'España',FR:'Francia',DE:'Alemania',IT:'Italia',PT:'Portugal'};
  return validateDataset({meta:{id:'eurostat-'+geo+'-'+year,name:(names[geo]||geo)+' · '+year,kind:'oficial',
    source:'Eurostat, Population on 1 January by age and sex (demo_pjan).',
    sourceUrl:'https://ec.europa.eu/eurostat/databrowser/view/demo_pjan/default/table?lang=en',
    referenceDate:year+'-01-01',updatedAt:String(json.updated||'No comunicada'),
    unit:'personas',limitations:'Cifras oficiales del conjunto demo_pjan. Verificar notas, banderas, revisiones y comparabilidad temporal.'},cohorts});
}
export const CASES=Object.freeze([
  {id:'C1',name:'Envejecimiento y redes comunitarias',dataset:'envejecida',question:'¿Demuestra una cúspide ancha que la población mayor depende funcionalmente de terceros?',answer:false,why:'La edad y la dependencia funcional son conceptos diferentes. Se requieren datos sobre autonomía, redes, preferencias y servicios.',activity:'Diseña una consulta participativa con personas mayores y una propuesta condicional de accesibilidad.'},
  {id:'C2',name:'Infancia y recursos socioeducativos',dataset:'joven',question:'¿Una proporción juvenil elevada demuestra falta de plazas escolares?',answer:false,why:'Se necesitan escolarización, capacidad, distribución espacial, movilidad y demandas de la comunidad.',activity:'Especifica indicadores de acceso a actividades extraescolares y un procedimiento participativo.'},
  {id:'C3',name:'Despoblación rural: hipótesis alternativas',dataset:'transicion',question:'¿Puede inferirse la emigración juvenil como causa única de una muesca observada?',answer:false,why:'Una pirámide transversal no permite aislar emigración, natalidad, mortalidad ni efectos de cohorte.',activity:'Propón datos longitudinales y entrevistas que permitan contrastar varias hipótesis.'},
  {id:'C4',name:'Cambio urbano y comparabilidad',dataset:'muesca',question:'¿Dos pirámides normalizadas pueden compararse directamente sin conocer su fecha y definición?',answer:false,why:'La escala proporcional no resuelve cambios de cobertura, años, fuentes ni definiciones.',activity:'Elabora una matriz de comparabilidad y describe un cambio territorial sin atribuciones causales.'},
  {id:'C5',name:'Diversidad y convivencia',dataset:'joven',question:'¿La forma de la pirámide permite conocer la cultura o los valores de un colectivo?',answer:false,why:'Inferir identidades o prácticas culturales desde grupos de edad supone un sesgo de atribución.',activity:'Codiseña una exploración comunitaria que evite esencialismos y preserve derechos.'},
  {id:'C6',name:'Diagnóstico territorial participativo',dataset:'envejecida',question:'¿Es pertinente contrastar los indicadores demográficos con necesidades expresadas por la comunidad?',answer:true,why:'El diagnóstico socioeducativo exige triangulación, participación e información contextual.',activity:'Construye una hipótesis, fuentes adicionales, actividades y tres indicadores evaluables.'}
]);
export function gradeCase(id,response){
  const c=CASES.find(c=>c.id===id);if(!c)error('Caso no encontrado');
  return {correct:response===c.answer,answer:c.answer,explanation:c.why};
}
