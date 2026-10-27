export const VERSION = '2.0.1';
export const AGES = Array.from({length:18},(_,i)=>i===17?'85+':`${i*5}-${i*5+4}`);
export const safeRatio = (n,d,factor=100) => d===0 ? null : n/d*factor;
export function validateDataset(d) {
  const errors=[];
  if(!d||typeof d!=='object') return ['Se esperaba un objeto de conjunto de datos.'];
  for(const key of ['id','territory','territoryCode','source','sourceUrl','referenceDate','updated','version','method','sexDefinition']) if(typeof d[key]!=='string'||!d[key].trim()||d[key].length>2000) errors.push(`Metadato obligatorio o longitud incorrecta: ${key}.`);
  for(const key of ['license','retrieved','rawSha256','queryUrl']) if(d[key]!==undefined&&(typeof d[key]!=='string'||d[key].length>2000))errors.push(`Metadato opcional incorrecto: ${key}; debe ser texto.`);
  if(!Number.isInteger(d.year)||d.year<1800||d.year>2200) errors.push('El año debe ser un entero entre 1800 y 2200.');
  if(d.kind==='observed'&&(!/^\d{4}-\d{2}-\d{2}$/.test(d.referenceDate)||Number(d.referenceDate.slice(0,4))!==d.year||Number.isNaN(Date.parse(d.referenceDate))||new Date(d.referenceDate).toISOString().slice(0,10)!==d.referenceDate))errors.push('Los datos observados requieren una fecha ISO válida y coherente con el año de referencia.');
  if(!['observed','synthetic','scenario','projection'].includes(d.kind)) errors.push('Tipo de datos no reconocido.');
  if(d.unit!=='persons') errors.push('La unidad admitida es persons: recuentos de personas.');
  if(typeof d.sourceUrl==='string'&&!/^https:\/\/[^\s]+$/i.test(d.sourceUrl)) errors.push('La URL de procedencia debe utilizar https.');
  if(!Array.isArray(d.limitations)||!d.limitations.length||d.limitations.some(x=>typeof x!=='string'||x.length>2000)) errors.push('Incluye al menos una limitación textual.');
  if(!Array.isArray(d.rows)||d.rows.length!==18) errors.push('Se requieren exactamente 18 grupos quinquenales de 0-4 a 85+.');
  else d.rows.forEach((r,i)=>{
    if(!r||r.age!==AGES[i]) errors.push(`Grupo ${i+1}: se esperaba ${AGES[i]}; no se admiten huecos, duplicados ni grupos reordenados.`);
    for(const k of ['male','female']) if(!Number.isSafeInteger(r?.[k])||r[k]<0) errors.push(`Grupo ${i+1}, ${k}: introduce un recuento entero no negativo, sin valores ausentes.`);
  });
  const total=Array.isArray(d.rows)?d.rows.reduce((s,r)=>s+(Number.isFinite(r?.male)?r.male:0)+(Number.isFinite(r?.female)?r.female:0),0):0;
  if(!Number.isSafeInteger(total)||total<=0) errors.push('El total debe ser positivo y estar dentro del rango entero seguro.');
  if(!Number.isSafeInteger(d.total)||d.total!==total) errors.push('El total declarado no coincide con la suma de los grupos.');
  return errors;
}
export function indicators(d) {
  const errors=validateDataset(d); if(errors.length) throw Error(errors.join('\n'));
  const sum=(start,end,k)=>d.rows.slice(start,end).reduce((s,r)=>s+(k?r[k]:r.male+r.female),0);
  const young=sum(0,3), adult=sum(3,13), old=sum(13,18), male=sum(0,18,'male'), female=sum(0,18,'female');
  return {total:d.total,young,adult,old,male,female,depYouth:safeRatio(young,adult),depOld:safeRatio(old,adult),depTotal:safeRatio(young+old,adult),aging:safeRatio(old,young),shareYoung:safeRatio(young,d.total),shareOld:safeRatio(old,d.total),sexRatio:safeRatio(male,female),womenOld:safeRatio(sum(13,18,'female'),sum(13,18,'male'))};
}
export const DEFINITIONS = [
  ['depYouth','Dependencia juvenil','P0-14 / P15-64 × 100','Personas de 0 a 14 por cada 100 de 15 a 64; relación entre edades, no carga económica real.'],
  ['depOld','Dependencia de mayores','P65+ / P15-64 × 100','Personas de 65 o más por cada 100 de 15 a 64; no mide dependencia funcional.'],
  ['depTotal','Dependencia total','(P0-14 + P65+) / P15-64 × 100','Suma de ambas relaciones demográficas. La población de 15 a 64 no equivale a población ocupada.'],
  ['aging','Índice de envejecimiento','P65+ / P0-14 × 100','Personas de 65 o más por cada 100 de 0 a 14. No mide directamente el reemplazo generacional.'],
  ['shareYoung','Proporción de 0 a 14','P0-14 / Ptotal × 100','Porcentaje del total de ambos sexos. Este grupo no abarca a todos los menores legales de 18 años.'],
  ['shareOld','Proporción de 65 o más','P65+ / Ptotal × 100','Porcentaje del total de ambos sexos; la edad no determina autonomía o necesidades.'],
  ['sexRatio','Razón de hombres por mujeres','H / M × 100','Hombres por cada 100 mujeres según las categorías de la fuente. No es una medida de identidad de género.'],
  ['womenOld','Mujeres por hombres de 65 o más','M65+ / H65+ × 100','Mujeres de 65 o más por cada 100 hombres de esas edades. No mide por sí sola desigualdad ni viudedad.']
];
export function comparison(a,b) {
  if(a.unit!==b.unit||a.rows.map(r=>r.age).join('|')!==b.rows.map(r=>r.age).join('|')) throw Error('Grupos o unidades incompatibles.');
  const A=indicators(a), B=indicators(b);
  return {A,B,differences:Object.fromEntries(['total',...DEFINITIONS.map(x=>x[0])].map(k=>[k,{absolute:A[k]===null||B[k]===null?null:B[k]-A[k],relative:A[k]===null||B[k]===null||A[k]===0?null:(B[k]-A[k])/A[k]*100}]))};
}
export function reason(d) {
  const n=indicators(d);
  const make=(id,indicator,rule,observation,interpretation,hypotheses,investigate,conditional,limits)=>({id,dataId:d.id,version:d.version,source:d.sourceUrl,indicator,value:n[indicator],rule,observation,interpretation,hypotheses,investigate,conditional,evidence:`Definición aritmética del indicador aplicada a ${d.source}. La procedencia se declara en los metadatos; la orientación socioeducativa es elaboración propia y requiere revisión profesional.`,limitations:limits});
  const rules=[make('R01','shareOld','Aplicar a todo conjunto válido; no utiliza umbral clínico.',`El ${n.shareOld.toFixed(2)} % tiene 65 años o más.`, 'Es una proporción de edades; no informa de autonomía, aislamiento ni uso de servicios.',['Supervivencia de cohortes anteriores','Fecundidad histórica y tamaño de cohortes','Entradas y salidas migratorias: requieren datos de flujos'],['Accesibilidad y uso de recursos','Preferencias y redes expresadas por las personas','Condiciones materiales y salud, con fuentes pertinentes'],'Si un diagnóstico participativo confirma barreras de participación, codiseñar actividades accesibles con las personas interesadas.',['Una fotografía no permite identificar causas.','Dependencia demográfica no equivale a dependencia funcional.']),
    make('R02','shareYoung','Aplicar a todo conjunto válido; grupo 0-14 explícito.',`El ${n.shareYoung.toFixed(2)} % tiene de 0 a 14 años.`, 'Cuantifica un grupo de edad. No demuestra déficits escolares ni permite calcular fecundidad.',['Cambios históricos en nacimientos','Movilidad residencial de familias','Supervivencia y efectos de cohortes'],['Escolarización y cobertura de recursos por edad','Opiniones de infancia y familias','Oferta, horarios y accesibilidad territorial'],'Si se confirma una brecha de acceso al ocio educativo, codiseñar una oferta con infancia, familias y entidades.',['El grupo 0-14 excluye adolescentes de 15-17.','No deducir natalidad o vulnerabilidad a partir de la base.'])];
  if(n.aging!==null) rules.push(make('R03','aging','P65+ / P0-14 × 100; comparar con 100 solo significa igualdad de tamaños.',`Hay ${n.aging.toFixed(2)} personas de 65 o más por cada 100 de 0 a 14.`,n.aging>100?'El grupo de 65 o más es más numeroso que el de 0 a 14.':n.aging===100?'Ambos grupos tienen el mismo tamaño.':'El grupo de 0 a 14 es más numeroso que el de 65 o más.',['Distintos tamaños de cohortes','Cambios en supervivencia y movilidad'],['Series comparables de edad','Nacimientos, defunciones y flujos migratorios'],'Si la comunidad expresa interés, estudiar un proyecto intergeneracional y evaluar participación y resultados.',['La razón no demuestra crisis de servicios ni reemplazo laboral.']));
  return rules.map(r=>({...r,observation:r.observation.replace(/(\d)\.(\d{2})/g,'$1,$2')}));
}
export function chartValues(d, mode='relative') {return d.rows.map(r=>({...r,m:mode==='relative'?r.male/d.total*100:r.male,f:mode==='relative'?r.female/d.total*100:r.female}));}
export function sharedScale(datasets,mode) {return Math.max(1,...datasets.flatMap(d=>chartValues(d,mode).flatMap(r=>[r.m,r.f])))*1.08;}
export function scenario(d,{births,survival,migration}) {
  if(!Number.isInteger(births)||births<0||!Number.isFinite(survival)||survival<0||survival>1||!Number.isInteger(migration)||migration<0) throw Error('Usa nacimientos y entradas enteros no negativos y supervivencia entre 0 y 1.');
  if(births>1e9||migration>1e9) throw Error('Parámetros demasiado grandes.');
  // Una transición de cinco años: nacimientos supervivientes agregados; 50/50 didáctico.
  const next = JSON.parse(JSON.stringify(d));
  next.rows=d.rows.map((r,i)=>{
    if(i===0) return {age:r.age,male:Math.floor(births/2),female:births-Math.floor(births/2)};
    const prev=d.rows[i-1];
    const base=i===17?{male:prev.male+r.male,female:prev.female+r.female}:prev;
    return {age:r.age,male:Math.round(base.male*survival),female:Math.round(base.female*survival)};
  });
  next.rows[5].male+=Math.floor(migration/2); next.rows[5].female+=migration-Math.floor(migration/2);
  next.id=`scenario-${d.id}`; next.kind='scenario'; next.territory=`Escenario de ${d.territory}`; next.year=d.year+5; next.referenceDate=`Horizonte sintético ${next.year}`;next.version=`escenario-${VERSION}`;
  next.method='Una transición quinquenal de cohortes; supervivencia uniforme de personas existentes, 85+ absorbente; nacimientos supervivientes agregados, entradas no negativas en 25-29, reparto didáctico 50/50.';
  next.source=`Simulación propia a partir de ${d.source}`;
  next.scenarioParameters={births,survival,migration,stepYears:5};
  next.baseDataset=JSON.parse(JSON.stringify(d));
  next.method+=` Parámetros B=${births}, q=${survival}, M=${migration}; conjunto de partida ${d.id}, versión ${d.version}.`;
  next.limitations=['Simulación didáctica sin calibración ni validación predictiva. No es una proyección oficial.','No modela fecundidad por edad, mortalidad diferencial, emigración ni distribución real por sexo.'];
  next.total=next.rows.reduce((s,r)=>s+r.male+r.female,0); if(validateDataset(next).length) throw Error('El escenario produce un conjunto no válido.'); return next;
}
