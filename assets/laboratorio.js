/* Interfaz de investigación guiada. Entradas textuales: solo textContent. */
(function(){"use strict";
const core=window.DemoCore;
if(!core){document.body.textContent="No se ha podido cargar el núcleo demográfico.";return;}
const el=id=>document.getElementById(id), nf=new Intl.NumberFormat("es-ES",{maximumFractionDigits:1}), whole=new Intl.NumberFormat("es-ES",{maximumFractionDigits:0});
const fields=["step1","step2","step3","step4","step5","step6","step7"];
const datasets=core.SYNTHETIC.slice(), STORE="laboratorio-demografia-2026-respuestas-v1";
const metrics=[
 ["Población total","total","Personas contabilizadas"],
 ["Población de 0–14 años","young","Suma de los grupos 0–4, 5–9 y 10–14"],
 ["Población de 15–64 años","working","Suma de 15–19 hasta 60–64"],
 ["Población de 65 años o más","older","Suma desde 65–69 hasta 85+"],
 ["Proporción de 0–14 años","youthShare","(0–14) / total × 100","%"],
 ["Proporción de 65+","olderShare","(65+) / total × 100","%"],
 ["Dependencia juvenil (demográfica)","youthDependency","(0–14) / (15–64) × 100","por 100"],
 ["Dependencia de mayores (demográfica)","oldDependency","(65+) / (15–64) × 100","por 100"],
 ["Dependencia demográfica total","totalDependency","(0–14 + 65+) / (15–64) × 100","por 100"],
 ["Índice de envejecimiento","ageingIndex","(65+) / (0–14) × 100","por 100"],
 ["Relación H/M","sexRatio","Hombres / mujeres × 100","por 100"]
];
const cases=[
 {title:"Envejecimiento y participación comunitaria",context:"Dos perfiles con distintas proporciones de mayores no prueban la existencia de soledad ni necesidades de apoyo. Examina las condiciones reales de participación.",question:"¿Qué redes, oportunidades de decisión y recursos de accesibilidad existen? ¿Cómo preguntarías a las personas mayores por sus prioridades?",mistake:"Confundir dependencia demográfica con dependencia funcional; atribuir soledad a todas las personas de 65+.",action:"Diseña, solo si el diagnóstico lo respalda, un proceso participativo de actividades y mejora de accesibilidad.",criteria:"Justifica indicadores de participación, autodeterminación y acceso efectivo a recursos."},
 {title:"Infancia y adolescencia: recursos educativos",context:"Un peso elevado de infancia no informa por sí mismo sobre abandono escolar ni pobreza familiar.",question:"¿Con qué datos de escolarización, oferta de ocio educativo y barreras de acceso contrastarías tus hipótesis?",mistake:"Equiparar presencia infantil a necesidad educativa acreditada.",action:"Define una propuesta condicionada a la consulta con familias, centros y menores.",criteria:"Distingue cobertura, asistencia, experiencia participativa y resultados del programa."},
 {title:"Despoblación rural y accesibilidad territorial",context:"La distribución por edades es solo una parte del diagnóstico territorial. Faltan evolución temporal, distancias y disponibilidad de servicios.",question:"¿Qué trayectorias de movilidad, conectividad, transporte y servicios necesitas investigar?",mistake:"Inferir emigración juvenil como única explicación de la estructura.",action:"Plantea una actuación comunitaria viable en cooperación con entidades y administración local.",criteria:"Incluye seguimiento del acceso real y de las barreras territoriales."},
 {title:"Transformaciones urbanas",context:"La comparación de pirámides de dos áreas urbanas no permite inferir por sí sola procesos de gentrificación o desplazamiento.",question:"¿Qué series de vivienda, rentas, permanencia residencial y movilidad espacial utilizarías?",mistake:"Atribuir causalidad al cambio de forma sin datos longitudinales.",action:"Plantea un diagnóstico con agentes vecinales y diversidad de grupos residentes.",criteria:"Integra triangulación de fuentes y análisis de posibles efectos no previstos."},
 {title:"Diversidad y convivencia",context:"Las diferencias por edad y sexo no describen identidades culturales, preferencias ni conductas colectivas.",question:"¿Cómo incorporarías la participación intercultural sin esencializar a los grupos?",mistake:"Asociar una distribución demográfica a valores o problemas de convivencia.",action:"Propón espacios de escucha e inclusión definidos con la comunidad.",criteria:"Evalúa acceso, representatividad, participación y posibles discriminaciones."},
 {title:"Diagnóstico territorial participativo",context:"Una pirámide facilita la descripción inicial, pero no sustituye el diagnóstico socioeducativo ni la deliberación con las personas implicadas.",question:"¿Qué información cuantitativa y cualitativa reunirías y cómo resolverías discrepancias entre fuentes?",mistake:"Presentar prioridades del equipo técnico como necesidades expresadas por la población.",action:"Diseña un proceso de investigación-acción con devolución de resultados accesible.",criteria:"Define indicadores, responsabilidades, protección de datos y mecanismos de revisión."}
];
function node(tag,text,className){const x=document.createElement(tag);if(text!==undefined)x.textContent=String(text);if(className)x.className=className;return x;}
function addOptions(){for(const id of ["datasetA","datasetB"]){const select=el(id);select.replaceChildren();for(const d of datasets){const opt=node("option",d.nombre);opt.value=d.id;select.appendChild(opt);}}el("datasetA").value=datasets[0].id;el("datasetB").value=datasets[1].id;}
function selected(){const a=datasets.find(d=>d.id===el("datasetA").value),b=datasets.find(d=>d.id===el("datasetB").value);if(!a||!b)throw Error("No hay datos seleccionados.");return [a,b];}
function format(n){return n===null||n===undefined||!Number.isFinite(n)?"No calculable":nf.format(n);}
function fmtMetric(n,unit){return n===null?"No calculable":unit?format(n)+" "+unit:whole.format(n);}
function tableRows(id,d){const body=el(id);body.replaceChildren();for(const b of d.bandas){const row=node("tr");for(const value of [b.edad,whole.format(b.hombres),whole.format(b.mujeres),whole.format(b.hombres+b.mujeres)])row.appendChild(node("td",value));body.appendChild(row);}}
function bars(id,d,maxP){const chart=el(id);chart.replaceChildren();for(const b of d.bandas.slice().reverse()){const r=node("div",undefined,"pyramid-row"),male=node("div",undefined,"half male"),female=node("div",undefined,"half female");const m=node("span"),f=node("span");m.style.width=String((b.hombres/d.total*100)/maxP*100)+"%";f.style.width=String((b.mujeres/d.total*100)/maxP*100)+"%";male.appendChild(m);female.appendChild(f);r.append(male,node("span",b.edad,"age"),female);chart.appendChild(r);}}
function showStats(a,b){const ia=core.indicators(a),ib=core.indicators(b);const t=el("metricsBody");t.replaceChildren();for(const [name,key,definition,unit] of metrics){const tr=node("tr");const th=node("th",name);th.scope="row";tr.append(th,node("td",fmtMetric(ia[key],unit)),node("td",fmtMetric(ib[key],unit)),node("td",definition));t.appendChild(tr);}}
function showCase(){const c=cases[Number(el("caseSelect").value)]||cases[0],div=el("caseText");div.replaceChildren(node("h3",c.title));for(const [title,body] of [["Contexto",c.context],["Pregunta de investigación",c.question],["Error interpretativo que debes evitar",c.mistake],["Actividad propuesta",c.action],["Criterios de evaluación",c.criteria]]){const p=node("p");const strong=node("strong",title+": ");p.append(strong,document.createTextNode(body));div.append(p);}}
function show(){
 const [a,b]=selected(),all=[a,b],maxP=Math.max(...all.flatMap(d=>d.bandas.flatMap(x=>[x.hombres/d.total*100,x.mujeres/d.total*100])));
 ["A","B"].forEach((suffix,i)=>{const d=all[i];el("label"+suffix).textContent=d.nombre;el("meta"+suffix).textContent="Periodo: "+d.periodo+" · "+(d.tipo==="sintetico"?"DATOS FICTICIOS":"IMPORTACIÓN NO VERIFICADA")+" · Fuente declarada: "+d.fuente;bars("chart"+suffix,d,maxP);tableRows("table"+suffix,d);});
 showStats(a,b);
 const desc=core.describe(a,b);el("observation").textContent=desc.observacion;el("contrast").textContent=desc.contraste;el("rule").textContent=desc.regla;el("limitation").textContent=desc.limitacion;
 renderReport();
}
function reportString(){
 const [a,b]=selected(),ia=core.indicators(a),ib=core.indicators(b),d=core.describe(a,b),date=new Date().toLocaleDateString("es-ES");
 const arr=["INFORME DE ANÁLISIS DEMOGRÁFICO Y RAZONAMIENTO SOCIOEDUCATIVO","Fecha de elaboración: "+date,"Carácter: material formativo; no validado como diagnóstico oficial.","",
 "1. OBJETO Y DATOS","A: "+a.nombre+" | periodo: "+a.periodo+" | naturaleza: "+a.tipo+" | fuente declarada: "+a.fuente,
 "B: "+b.nombre+" | periodo: "+b.periodo+" | naturaleza: "+b.tipo+" | fuente declarada: "+b.fuente,
 "Importaciones sin verificación externa y modelos sintéticos inequívocamente ficticios.","",
 "2. METODOLOGÍA","Grupos: 0-4, 5-9, …, 85+. Jóvenes 0-14; edades 15-64; mayores 65+.",
 "Dependencia demográfica = población fuera del tramo 15-64 / población 15-64 × 100.",
 "Índice de envejecimiento = población 65+ / población 0-14 × 100.",
 "Los denominadores iguales a cero producen un indicador no calculable.",
 "Las categorías H/M reflejan el fichero introducido, no permiten inferir otras variables.","",
 "3. INDICADORES COMPARADOS (A | B)"];
 for(const [name,key,definition,unit] of metrics)arr.push(name+": "+fmtMetric(ia[key],unit)+" | "+fmtMetric(ib[key],unit)+" ("+definition+")");
 arr.push("","4. OBSERVACIÓN, COMPARACIÓN Y LIMITACIONES",d.observacion,d.contraste,d.regla,d.limitacion,"",
 "5. RESPUESTAS Y PROPUESTA DEL ESTUDIANTE");
 const labels=["Observación","Interpretación","Hipótesis alternativas","Necesidades por investigar","Investigación participativa","Propuesta condicionada","Evaluación y reflexión ética"];
 fields.forEach((f,i)=>arr.push((i+1)+". "+labels[i]+": "+(el(f).value.trim()||"[Pendiente de completar]")));
 arr.push("","6. DATOS DETALLADOS PARA REPRODUCIR LOS CÁLCULOS","Edad;A_H;A_M;B_H;B_M");
 for(let i=0;i<a.bandas.length;i++)arr.push([a.bandas[i].edad,a.bandas[i].hombres,a.bandas[i].mujeres,b.bandas[i].hombres,b.bandas[i].mujeres].join(";"));
 arr.push("","7. LÍMITES Y RESPONSABILIDAD PROFESIONAL",
 "El carácter sintético o no verificado impide extraer conclusiones sobre territorios reales sin comprobación de la fuente.",
 "La comparación de distribuciones no establece mecanismos causales ni necesidades sociales individualizadas.",
 "Antes de utilizarse en proyectos profesionales: contrastar fuentes, metodología, participación comunitaria y protección de datos.",
 "Fuentes generales para consulta: https://www.ine.es/aplicaciones/piramides/piramides.htm ; https://www.idescat.cat/ ; https://ec.europa.eu/eurostat/",
 "Aplicación: Laboratorio interactivo de demografía aplicada a la Educación Social · versión experimental.");
 return arr.join("\n");
}
function renderReport(){el("reportText").textContent=reportString();}
async function handleImport(){
 const status=el("importStatus"),file=el("importFile").files?.[0];status.textContent="";
 try{
  if(!file)throw Error("Selecciona un archivo CSV o JSON.");
  if(file.size>3000000)throw Error("El archivo supera 3 MB.");
  const territory=el("importTerritory").value.trim(),period=el("importPeriod").value.trim(),source=el("importSource").value.trim();
  if(!territory||!period||!source)throw Error("Indica territorio, periodo y fuente para conservar trazabilidad.");
  const text=await file.text();
  const d=core.importText(text,file.name,source,territory,period);
  datasets.push(d);for(const id of ["datasetA","datasetB"]){const opt=node("option",d.nombre+" · importado (sin verificar)");opt.value=d.id;el(id).append(opt);}
  el("datasetA").value=d.id;show();
  status.textContent="Importación validada estructuralmente: "+whole.format(d.total)+" registros poblacionales contabilizados. No se ha comprobado la procedencia original.";
 }catch(e){status.textContent="No se ha importado: "+e.message;}
}
function save(){
 try{const obj={version:1,answers:fields.map(f=>el(f).value.slice(0,15000))};localStorage.setItem(STORE,JSON.stringify(obj));el("progressStatus").textContent="Respuestas guardadas solo en este navegador.";}
 catch(e){el("progressStatus").textContent="No se han podido guardar; exporta el informe TXT.";}
}
function clear(){
 fields.forEach(f=>el(f).value="");try{localStorage.removeItem(STORE)}catch(e){}
 el("progressStatus").textContent="Respuestas locales eliminadas de este navegador.";renderReport();
}
function restore(){
 try{const obj=JSON.parse(localStorage.getItem(STORE)||"null");if(obj?.version===1&&Array.isArray(obj.answers))fields.forEach((f,i)=>{el(f).value=String(obj.answers[i]||"").slice(0,15000)});}
 catch(e){el("progressStatus").textContent="No se pudo restaurar el progreso local.";}
}
function download(){
 const blob=new Blob(["\uFEFF"+reportString()],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=node("a");a.href=url;a.download="informe-demografia-socioeducativa.txt";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function init(){addOptions();restore();showCase();show();
 ["datasetA","datasetB"].forEach(id=>el(id).addEventListener("change",show));
 el("swap").addEventListener("click",()=>{let a=el("datasetA").value;el("datasetA").value=el("datasetB").value;el("datasetB").value=a;show();});
 el("caseSelect").addEventListener("change",showCase);el("importButton").addEventListener("click",handleImport);
 el("saveProgress").addEventListener("click",save);el("clearProgress").addEventListener("click",clear);
 fields.forEach(f=>el(f).addEventListener("input",renderReport));
 el("downloadReport").addEventListener("click",download);el("printReport").addEventListener("click",()=>{renderReport();window.print();});
}
document.addEventListener("DOMContentLoaded",init);
if("serviceWorker" in navigator && location.protocol==="https:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
})();