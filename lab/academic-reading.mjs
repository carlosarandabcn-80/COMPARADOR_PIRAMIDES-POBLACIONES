/**
 * Lectura comparada de pirámides · Estructura Social.
 * Motor determinista: sin diagnóstico causal, sin datos añadidos y sin LLM.
 * Inspira el orden de lectura en el material de Estructura Social:
 * identificación -> morfología (base, tronco, cúspide, sexo) ->
 * comparación de cohortes -> lectura estructural -> límites.
 */
import {BANDS,check,indicators,classify,status} from './comparison-core.mjs';

const fmt=(v,decimals=2)=>v===null?'no calculable':new Intl.NumberFormat('es-ES',{minimumFractionDigits:decimals,maximumFractionDigits:decimals}).format(v);
const whole=v=>new Intl.NumberFormat('es-ES',{maximumFractionDigits:0}).format(v);
const percent=(n,total)=>total>0?100*n/total:null;
const signed=(v,decimals=2)=>v===null?'no calculable':(v>0?'+':'')+fmt(v,decimals);
const diff=(x,y)=>x===null||y===null?null:x-y;
const adjective=(delta,positive,negative,tol=0.005)=>delta===null?'sin valor comparable':delta>tol?positive:delta < -tol?negative:'prácticamente igual';
const qualify=(p)=>p===null?'no calculable':fmt(p)+' %';
const sum=(cohorts,from,to,sex)=>cohorts.slice(from,to).reduce((acc,c)=>acc+(sex?c[sex]:c.m+c.f),0);
const describeBase=(ratio)=>ratio===null?'no puede calcularse':ratio>=1.25?'es más ancha que el tramo de 30–44 años':ratio<=0.8?'es más estrecha que el tramo de 30–44 años':'se aproxima al tramo de 30–44 años';
const metaLabel=d=>d.meta.provider+' · '+d.meta.place+' · '+d.meta.year;
const phrase=(value,unit='pp')=>signed(value)+' '+unit;

/**
 * Devuelve cifras SIN redondear, para que los textos y las comparaciones
 * utilicen idénticos numeradores antes del formato final.
 */
export function profile(dataset){
 const d=check(dataset),cohorts=d.cohorts,total=d.total;
 const bandShares=cohorts.map(c=>({label:c.label,m:c.m,f:c.f,total:c.m+c.f,share:percent(c.m+c.f,total),maleShare:percent(c.m,total),femaleShare:percent(c.f,total)}));
 const youth=sum(cohorts,0,3),working=sum(cohorts,3,13),older=sum(cohorts,13,18);
 const youngAdults=sum(cohorts,3,7),middle=sum(cohorts,6,9);
 const baseRatio=middle?youth/middle:null; // cada bloque comprende tres grupos quinquenales
 const femaleOlder=sum(cohorts,13,18,'f'),maleOlder=sum(cohorts,13,18,'m');
 // El intervalo final 85+ es abierto: su anchura es mayor que cinco años.
 // Se excluye de los máximos entre bandas quinquenales comparables.
 const peak=[...bandShares.slice(0,17)].sort((a,b)=>b.share-a.share||BANDS.findIndex(c=>c.label===a.label)-BANDS.findIndex(c=>c.label===b.label))[0];
 const r=indicators(d),shape=classify(d);
 return {meta:d.meta,total,cohorts:bandShares,groups:{youth,working,older,youngAdults},
  shares:{youth:percent(youth,total),working:percent(working,total),older:percent(older,total),
   olderWomen:percent(femaleOlder,older),olderMen:percent(maleOlder,older),
   women:percent(r.women,total),men:percent(r.men,total),youngAdults:percent(youngAdults,total)},
  metrics:{ageing:youth?100*older/youth:null,dependency:working?100*(youth+older)/working:null},
  peak,baseRatio,shape};
}
function comparisonKind(a,b){
 const sameTerritory=a.meta.place===b.meta.place;
 const sameYear=a.meta.year===b.meta.year;
 const sameSource=a.meta.provider===b.meta.provider;
 if(sameTerritory&&sameYear&&sameSource)return 'misma-seleccion';
 if(sameTerritory&&sameYear&&!sameSource)return 'fuentes';
 if(sameTerritory&&!sameYear&&sameSource)return 'temporal';
 if(sameTerritory&&!sameYear&&!sameSource)return 'mixta-tiempo-fuente';
 if(!sameTerritory&&sameYear)return 'territorial';
 return 'mixta-tiempo-territorio';
}
function compareCohorts(a,b){
 const rows=a.cohorts.map((c,i)=>{
  const other=b.cohorts[i];
  return {label:c.label,a:c.share,b:other.share,delta:c.share-other.share,
   menA:c.maleShare,menB:other.maleShare,womenA:c.femaleShare,womenB:other.femaleShare};
 });
 // 85+ figura en la tabla, pero no puede competir con intervalos de cinco años.
 const sorted=[...rows.slice(0,17)].sort((x,y)=>Math.abs(y.delta)-Math.abs(x.delta)||BANDS.findIndex(b=>b.label===x.label)-BANDS.findIndex(b=>b.label===y.label));
 return {rows,largest:sorted[0],largestThree:sorted.slice(0,3),positive:[...rows.slice(0,17)].sort((x,y)=>y.delta-x.delta)[0],negative:[...rows.slice(0,17)].sort((x,y)=>x.delta-y.delta)[0]};
}
const cutoff=(num,unit,plus='mayor',minus='menor')=>{
 if(Math.abs(num)<0.005)return 'presentan valores prácticamente iguales';
 return num>0?'A registra un '+plus+' '+unit+' que B':'A registra un '+minus+' '+unit+' que B';
};
const ages=(p)=>'0–14 ('+fmt(p.shares.youth)+' %), 15–64 ('+fmt(p.shares.working)+' %) y 65+ ('+fmt(p.shares.older)+' %)';
const change=(a,b,part)=> {
 const d=diff(a.shares[part],b.shares[part]);
 if(Math.abs(d)<0.005)return 'una proporción prácticamente coincidente';
 return (d>0?'una proporción superior':'una proporción inferior')+' en '+fmt(Math.abs(d))+' puntos porcentuales';
};

export function academicComparison(first,second){
 const state=status(first,second);if(!state.ok)throw new Error(state.message);
 const a=profile(first),b=profile(second),kind=comparisonKind(a,b),c=compareCohorts(a,b);
 const delta={
  youth:diff(a.shares.youth,b.shares.youth),working:diff(a.shares.working,b.shares.working),
  older:diff(a.shares.older,b.shares.older),
  femaleOlder:diff(a.shares.olderWomen,b.shares.olderWomen),
  dependency:diff(a.metrics.dependency,b.metrics.dependency),
  ageing:diff(a.metrics.ageing,b.metrics.ageing)
 };
 const sameObservations=kind==='misma-seleccion';
 const firstLabel=metaLabel(a),secondLabel=metaLabel(b);
 const anchor='La muestra A ('+firstLabel+') incluye '+whole(a.total)+' personas de edad conocida y la B ('+secondLabel+'), '+whole(b.total)+'. '+
  'Ambas se representan en 18 intervalos quinquenales, con grupo abierto de 85 años o más y porcentajes calculados sobre el total de cada población.';
 const captionType=kind==='temporal'?'Dos observaciones temporales del mismo territorio y fuente.':
  kind==='territorial'?'Dos territorios observados en el mismo año.':
  kind==='fuentes'?'Mismo territorio y año, pero operaciones estadísticas distintas.':
  kind==='misma-seleccion'?'Dos selecciones equivalentes en territorio, fecha y fuente.':
  'Comparación heterogénea: cambian '+(a.meta.place===b.meta.place?'la fecha y la fuente':'el territorio y la fecha')+'.';

 const individual='La pirámide A tiene una base que '+describeBase(a.baseRatio)+', '+fmt(a.shares.older)+' % de habitantes de 65+ y presenta su mayor peso entre las bandas de cinco años en '+a.peak.label+' ('+fmt(a.peak.share)+' %). '+
 'La pirámide B muestra una base que '+describeBase(b.baseRatio)+', '+fmt(b.shares.older)+' % de 65+ y alcanza su mayor proporción entre los intervalos de cinco años en '+b.peak.label+' ('+fmt(b.peak.share)+' %). '+
 'La tipología orientativa es «'+a.shape.type+'» para A y «'+b.shape.type+'» para B. Estas etiquetas resumen la forma, no equivalen a categorías estadísticas oficiales.';

 const broad='En A, la distribución por grandes grupos es '+ages(a)+'. En B es '+ages(b)+'. '+
  'Al restar A menos B, la diferencia en el peso de menores de 15 años es '+phrase(delta.youth)+', la de edades 15–64 es '+phrase(delta.working)+' y la de 65 años o más es '+phrase(delta.older)+'. '+
  'Se expresan en puntos porcentuales, de modo que la comparación de estructuras no depende del volumen absoluto de cada territorio.';
 const detail=Math.abs(c.largest.delta)<0.005
  ?'Los 17 grupos quinquenales cerrados (0–4 a 80–84) presentan porcentajes equivalentes al redondear a dos decimales. No se identifica una banda quinquenal cerrada con diferencia material en la distribución comparada. La categoría abierta 85+ se compara por separado y la coincidencia de porcentajes no implica igualdad de efectivos absolutos.'
  :'La mayor separación entre intervalos quinquenales cerrados corresponde a '+c.largest.label+': en A representa '+fmt(c.largest.a)+' % y en B '+fmt(c.largest.b)+' %, diferencia '+phrase(c.largest.delta)+
  '. Los otros dos contrastes más acusados se localizan en '+c.largestThree.slice(1).map(r=>r.label+' ('+phrase(r.delta)+')').join(' y ')+'. '+
  'El signo refleja A menos B, no crecimiento o decrecimiento de una misma generación. '+
  'El grupo abierto 85+ se incluye en los indicadores y en la tabla, pero no se clasifica junto con bandas de cinco años. Una irregularidad o «muesca» puede motivar una hipótesis histórica, pero necesita datos externos de nacimientos, defunciones o migraciones para explicarse.';

 const gender='En el tramo de 65 años o más, la proporción femenina dentro del propio grupo es '+qualify(a.shares.olderWomen)+' en A y '+qualify(b.shares.olderWomen)+' en B, una diferencia de '+phrase(delta.femaleOlder)+'. '+
  'Se distingue aquí el porcentaje de mujeres entre las personas mayores del porcentaje de mujeres sobre la población total. '+
  'La asimetría observada no demuestra, por sí misma, mecanismos concretos de mortalidad diferencial, migración o composición por generaciones.';

 const metric='El índice de envejecimiento (personas de 65+ por cada 100 menores de 15) se sitúa en '+
  (a.metrics.ageing===null?'un valor no calculable':fmt(a.metrics.ageing))+' en A y '+(b.metrics.ageing===null?'un valor no calculable':fmt(b.metrics.ageing))+' en B. '+
  'La razón de dependencia demográfica total ((0–14 + 65+) / 15–64 × 100) es '+(a.metrics.dependency===null?'no calculable':fmt(a.metrics.dependency))+' en A y '+(b.metrics.dependency===null?'no calculable':fmt(b.metrics.dependency))+' en B. '+
  'Estas razones son convenciones de estructura por edades: no contabilizan personas inactivas, desempleadas o con dependencia funcional.';
 let interpretation;
 switch(kind){
 case 'temporal': {
  const later=a.meta.year>b.meta.year?a:b,earlier=a.meta.year>b.meta.year?b:a;
  const deltaTotal=100*(later.total-earlier.total)/earlier.total,pp=diff(later.shares.older,earlier.shares.older);
  interpretation='Como las dos observaciones corresponden a '+a.meta.place+' y proceden de '+a.meta.provider+', cabe describir una evolución entre '+earlier.meta.year+' y '+later.meta.year+'. '+
    'El volumen registrado '+(Math.abs(deltaTotal)<0.005?'permanece prácticamente constante':deltaTotal>0?'aumenta':'disminuye')+
    ' ('+signed(deltaTotal)+' % respecto al año inicial), mientras que el peso de 65+ '+(Math.abs(pp)<0.005?'se mantiene prácticamente igual':pp>0?'aumenta':'disminuye')+' '+fmt(Math.abs(pp))+' puntos porcentuales. '+
    'Es una comparación de distribuciones transversales en dos fechas, no un seguimiento de personas ni de las mismas cohortes de nacimiento. '+
    'Las causas del cambio deben contrastarse con series de fecundidad, mortalidad, migración y posibles revisiones metodológicas.';
  break;
 }
 case 'fuentes':
  interpretation='A y B se refieren a '+a.meta.place+' en '+a.meta.year+', pero sus fuentes son '+a.meta.provider+' y '+b.meta.provider+'. '+
   'Las divergencias corresponden a cifras publicadas por operaciones distintas; no describen evolución temporal. '+
   'Antes de interpretarlas como diferencias sustantivas se deben revisar cobertura poblacional, definiciones, estimaciones, ajustes y revisiones estadísticas.';
  break;
 case 'territorial':
  interpretation='El contraste entre '+a.meta.place+' y '+b.meta.place+' se realiza para '+a.meta.year+'. '+
   'La diferencia de composición por edades es descriptiva y no establece por qué las poblaciones tienen estructuras distintas. '+
   'La atribución de mecanismos demográficos o sociales requeriría información contextual y series comparables de los dos territorios.';
  break;
 case 'misma-seleccion':
  interpretation='Las dos selecciones representan el mismo territorio, fuente y año. En ausencia de revisiones o incidencias de captura, sus valores deben coincidir; si difieren, corresponde verificar la consistencia de la consulta antes de extraer conclusiones.';
  break;
 case 'mixta-tiempo-fuente':
  interpretation='Cambian simultáneamente la fecha y la operación estadística para el mismo territorio. '+
   'Aunque los porcentajes son comparables como descripciones, no debe presentarse la diferencia observada como cambio demográfico neto sin verificar la continuidad metodológica entre fuentes.';
  break;
 default:
  interpretation='Cambian el territorio y la fecha, por lo que las diferencias reúnen componentes espaciales y temporales. '+
   'No puede atribuirse a un solo proceso ni llamarse evolución del mismo territorio; debe indicarse el doble contraste y analizar por separado series homogéneas.';
 }
 const structural='En el marco de Estructura Social, la forma demográfica constituye una dimensión de la estructura de la población. '+
  'Su lectura permite formular preguntas sobre la distribución generacional y las relaciones con instituciones, empleo, educación o cuidados a escala macro, meso y micro; no mide directamente clase social, condiciones de vida, desigualdad ni acceso efectivo a servicios. '+
  'De acuerdo con el enfoque de descripción y comparación del material de la asignatura, se debe separar el patrón observado de las hipótesis explicativas y evitar inferir necesidades sociales sin indicadores adicionales.';

 const structureContrast=delta.older>0.005&&delta.youth< -0.005?'A muestra una estructura relativamente más envejecida (más peso de 65+ y menos de menores de 15) que B. ':
  delta.older< -0.005&&delta.youth>0.005?'B muestra una estructura relativamente más envejecida (más peso de 65+ y menos de menores de 15) que A. ':
  'Las variaciones en la base y la cúspide no indican una contraposición única entre población joven y envejecida. ';
 const verdict='En síntesis, A presenta '+change(a,b,'youth')+' de 0–14 años y '+change(a,b,'older')+' de 65 años o más respecto de B. '+structureContrast+
   'La mayor diferencia entre grupos quinquenales cerrados se sitúa en '+c.largest.label+' ('+phrase(c.largest.delta)+'). '+
   (sameObservations?'La coincidencia de fuente, fecha y territorio impide hablar de una transformación entre ambos gráficos.':
   'La lectura es descriptiva y debe mantenerse condicionada por la comparabilidad de fuentes, fechas y territorios.') ;
 const sections=[
  {id:'identificacion',title:'1. Identificación y comparabilidad',text:anchor+' '+captionType},
  {id:'morfologia',title:'2. Morfología: base, tronco y cúspide',text:individual},
  {id:'edades',title:'3. Composición por grandes edades',text:broad},
  {id:'cohortes',title:'4. Cohortes: mayores divergencias',text:detail},
  {id:'sexo',title:'5. Estructura por sexo y edad',text:gender},
  {id:'indicadores',title:'6. Índices demográficos',text:metric},
  {id:'contexto',title:'7. Tipo de comparación y límites',text:interpretation},
  {id:'estructura',title:'8. Lectura desde Estructura Social',text:structural},
  {id:'conclusion',title:'9. Síntesis comparativa',text:verdict}
 ];
 const caution=['Los valores A−B en porcentajes se expresan en puntos porcentuales; las personas se expresan en efectivos absolutos.',
  'La clasificación expansiva, estacionaria o regresiva es una aproximación didáctica, no una inferencia demográfica causal.',
  'El tramo 85+ es abierto, no tiene la misma anchura que las 17 bandas quinquenales cerradas y queda excluido del ranking de picos o divergencias quinquenales.',
  'Los indicadores de dependencia expresan estructura etaria; no miden dependencia funcional ni económica.',
  ...((a.meta.provider!==b.meta.provider)?['Se contrastan dos operaciones estadísticas; hay que verificar sus diferencias metodológicas.']:[])
 ];
 return {a,b,kind,delta,cohorts:c,sections,caution,
  wordCount:sections.map(s=>s.text).join(' ').trim().split(/\s+/).length,
  fullText:sections.map(s=>s.title+'\n'+s.text).join('\n\n')};
}
