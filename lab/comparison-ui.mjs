import {COUNTRIES,indicators,status,describe,compare,eurostatURL,fromEurostat,parseINE,INE_TERRITORIES,ineTerritoryURL,parseINETerritory,IDESCAT_TERRITORIES,parseIdescatSnapshot} from './comparison-core.mjs';
import {MODELS} from './morphology.mjs';
import {academicComparison,compareCohorts,comparisonContext,signed} from './academic-reading.mjs';
const $=id=>document.getElementById(id),format=new Intl.NumberFormat('es-ES',{maximumFractionDigits:2}),n=x=>x===null?'No calculable':format.format(x);
const percentFormat=new Intl.NumberFormat('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2});
const share=x=>percentFormat.format(x)+' %';
const countShare=(count,pct)=>'<span class="count-share">'+n(count)+' personas</span><span class="count-share">'+share(pct)+'</span>';
const esc=s=>String(s).replace(/[&<>"']/g,v=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[v]));
const state={A:null,B:null,revision:{A:0,B:0},controllers:{A:null,B:null},catalogVersion:{A:0,B:0},catalogPromise:{A:null,B:null}};
const eurostatArchives=new Map();
const INE_PLACES=Object.fromEntries(Object.entries(INE_TERRITORIES).map(([key,v])=>[key,v.title]));
const labels=[['pYouth','0–14 años','%'],['pActive','15–64 años','%'],['pOld','65+ años','%'],['ageing','Índice envejecimiento','65+/0–14 × 100'],['dependency','Dependencia demográfica','(0–14 + 65+) / 15–64 × 100'],['total','Población representada','personas']];
const select=(form,key)=>form.elements.namedItem(key);
function setupForm(side,defYear){
 const f=$('form'+side),provider=select(f,'provider'),place=select(f,'place'),year=select(f,'year');
 const refreshYears=preferredYear=>{
  const source=provider.value;
  const range=source==='ine'?INE_TERRITORIES[place.value]:
   source==='idescat'?{start:2025,end:2025}:{start:1960,end:2025};
  year.disabled=false;
  year.replaceChildren(...Array.from({length:range.end-range.start+1},(_,i)=>new Option(String(range.end-i))));
  if([...year.options].some(option=>option.value===preferredYear))year.value=preferredYear;
  state.catalogVersion[side]++;
  clear(side);
  state.catalogPromise[side]=source==='eurostat'?ensureYears(side):Promise.resolve();
  return state.catalogPromise[side];
 };
 const configure=(source,preferredPlace,preferredYear=String(defYear))=>{
  provider.value=source;
  const places=source==='ine'?INE_PLACES:source==='idescat'?IDESCAT_TERRITORIES:COUNTRIES;
  place.replaceChildren(...Object.entries(places).map(([code,name])=>new Option(name,code)));
  if(Object.hasOwn(places,preferredPlace))place.value=preferredPlace;
  return refreshYears(preferredYear);
 };
 provider.addEventListener('change',()=>configure(provider.value));
 place.addEventListener('change',()=>refreshYears(provider.value==='eurostat'?year.value:undefined));
 year.addEventListener('change',()=>clear(side));
 f.addEventListener('submit',e=>{e.preventDefault();load(side);});
 configure(provider.value);
 return configure;
}
function clear(side){
 state.revision[side]++;
 state.controllers[side]?.abort();
 state.controllers[side]=null;
 const hadData=Boolean(state[side]);
 state[side]=null;
 const form=$('form'+side),button=form.querySelector('button[type=submit]');
 button.disabled=select(form,'year').disabled;
 button.removeAttribute('aria-disabled');
 $('status'+side).textContent='Selecciona el periodo y carga datos oficiales.';
 $('status'+side).className='status';
 $('chart'+side).innerHTML='<div class="placeholder">Sin datos cargados para esta selección.</div>';
 for(const id of ['meta','stats','table','desc'])$(id+side).replaceChildren();
 if(hadData)refreshCharts();
 resultReset();
 updateButtons();
}
function resultReset(){
 $('results').innerHTML='<h3>Resultado comparativo</h3><p>Selecciona dos fuentes y periodos y pulsa «Comparar estructuras A y B».</p>';
 $('comparison-announcement').textContent='';
 renderContext();
}
function renderContext(){
 const slot=$('comparison-context');
 slot.hidden=!state.A||!state.B;
 if(slot.hidden){slot.replaceChildren();return;}
 const context=comparisonContext(state.A,state.B);
 const list=(entries,className)=>'<ul class="'+className+'">'+entries.map(entry=>'<li>'+esc(entry)+'</li>').join('')+'</ul>';
 slot.innerHTML='<h3 class="comparison-context-title">'+esc(context.heading)+'</h3>'+
  list(context.sources,'comparison-context-sources')+
  '<p class="comparison-context-summary">'+esc(context.summary)+'</p>'+
  (context.warnings.length?'<p><strong>Avisos de comparabilidad</strong></p>'+list(context.warnings,'comparison-warnings'):'');
}
function updateButtons(){const ready=Boolean(state.A&&state.B&&status(state.A,state.B).ok);$('analyze').disabled=!ready;$('export').disabled=!ready;$('print').disabled=!ready;$('exportCSV').disabled=!ready;}
function setStatus(side,message,isError=false){const el=$('status'+side);el.textContent=message;el.className='status '+(isError?'error':'good');}
async function getJSON(url,ms=25000,externalSignal){
 const control=new AbortController(),t=setTimeout(()=>control.abort(),ms);
 const cancel=()=>control.abort();externalSignal?.addEventListener('abort',cancel,{once:true});
 try{
  const response=await fetch(url,{signal:control.signal,cache:'no-store'});
  if(!response.ok)throw new Error('La fuente devolvió HTTP '+response.status);
  const length=Number(response.headers.get('content-length')||0);
  if(length>80000000)throw new Error('Respuesta demasiado grande. Escoge otra selección.');
  return await response.json();
 }finally{clearTimeout(t);externalSignal?.removeEventListener('abort',cancel);}
}
function availableEurostatYears(json,geo){
 const index=json?.dimension?.time?.category?.index;
 const years=(Array.isArray(index)?index:Object.keys(index||{})).map(Number).filter(y=>Number.isInteger(y)&&y>=1960&&y<=2025).sort((a,b)=>b-a);
 return years.filter(y=>{try{fromEurostat(json,geo,y);return true;}catch{return false;}});
}
function getEurostatArchive(geo){
 if(!eurostatArchives.has(geo)){
  const url=new URL(eurostatURL(geo,2025));url.searchParams.delete('time');
  const promise=getJSON(url.toString(),40000).catch(err=>{eurostatArchives.delete(geo);throw err;});
  eurostatArchives.set(geo,promise);
 }
 return eurostatArchives.get(geo);
}
async function ensureYears(side){
 const form=$('form'+side),country=select(form,'place'),year=select(form,'year'),button=form.querySelector('button[type=submit]');
 const code=country.value,previous=year.value,token=state.catalogVersion[side];
 year.disabled=true;button.disabled=true;setStatus(side,'Consultando los años con pirámides completas para '+country.selectedOptions[0].textContent+'…');
 try{
  const archive=await getEurostatArchive(code);
  if(state.catalogVersion[side]!==token)return;
  const available=availableEurostatYears(archive,code);
  if(!available.length){year.replaceChildren();setStatus(side,'La API no ofrece pirámides quinquenales completas para este territorio.',true);return;}
  year.replaceChildren(...available.map(y=>new Option(String(y),String(y))));
  year.value=available.includes(Number(previous))?previous:String(available[0]);
  setStatus(side,'Años comprobados con datos oficiales: '+available.length+'. Selecciona uno y carga la pirámide.');
 }catch{
  if(state.catalogVersion[side]===token){
   setStatus(side,'Catálogo de Eurostat no disponible. Puedes intentar cargar el año directamente.',true);
  }
 }finally{
  if(state.catalogVersion[side]===token){year.disabled=year.options.length===0;button.disabled=year.disabled;}
 }
}
async function load(side){
 const f=$('form'+side),period=select(f,'year');
 if(period.disabled||!period.value||state.controllers[side])return;
 const provider=select(f,'provider').value,place=select(f,'place').value,year=Number(period.value);
 clear(side);const revision=state.revision[side],controller=new AbortController();state.controllers[side]=controller;
 const button=f.querySelector('button[type=submit]');button.setAttribute('aria-disabled','true');
 setStatus(side,provider==='idescat'?'Cargando la copia oficial de Idescat · '+year+'…':
  'Consultando '+(provider==='ine'?'INE':'Eurostat')+' · '+year+'…');
 try{
  let dataset;
  if(provider==='eurostat')dataset=fromEurostat(await (eurostatArchives.get(place) || getJSON(eurostatURL(place,year),35000,controller.signal)),place,year);
  else if(provider==='ine'){
   const json=await getJSON(ineTerritoryURL(place,year),90000,controller.signal);
   dataset=place==='ES'?parseINE(json,year):parseINETerritory(json,place,year);
  }
  else dataset=parseIdescatSnapshot(await getJSON('./data/idescat-municipios-2025.json',15000,controller.signal),place,year);
  if(revision!==state.revision[side])return;
  showDataset(side,dataset,'Datos oficiales cargados y validados. '+dataset.meta.provider+' · '+dataset.meta.place+' · '+year+'.');
 }catch(error){
  if(revision===state.revision[side]){
   const reason=error.name==='AbortError'?'La consulta ha superado el tiempo disponible':
    error instanceof TypeError?'La fuente no responde desde este navegador':error.message.replace(/\.+$/,'');
   setStatus(side,'No se han podido obtener datos válidos. '+reason+'. Comprueba la fuente y vuelve a intentarlo.',true);
  }
 }finally{if(revision===state.revision[side]){state.controllers[side]=null;button.removeAttribute('aria-disabled');}}
}
function maxShared(scale){
 const arr=[state.A,state.B].filter(Boolean),values=arr.flatMap(d=>d.cohorts.flatMap(b=>scale==='percent'?[b.m/d.total*100,b.f/d.total*100]:[b.m,b.f]));
 return Math.max(.01,...values);
}
function chart(d,side,scale,focus,max,differences){
 const {total}=d,mid=290,span=211,top=30,row=23.4;
 const active=(i,label)=>focus==='all'||(focus==='young'&&i<3)||(focus==='adult'&&i>=3&&i<13)||
  (focus==='old'&&i>=13)||(focus==='diff'&&(!differences.length||differences.includes(label)));
 const rects=d.cohorts.map((v,i)=>{const a=scale==='percent'?v.m*100/total:v.m,b=scale==='percent'?v.f*100/total:v.f,
  mw=span*a/max,fw=span*b/max,y=top+(17-i)*row;
  const dim=active(i,v.label)?'':' dim';
  return '<rect x="'+(mid-mw)+'" y="'+y+'" width="'+mw+'" height="17" class="bar-m'+dim+'"><title>'+esc(v.label)+' · hombres '+n(v.m)+'</title></rect>'+
   '<rect x="'+mid+'" y="'+y+'" width="'+fw+'" height="17" class="bar-f'+dim+'"><title>'+esc(v.label)+' · mujeres '+n(v.f)+'</title></rect>'+
   '<text x="'+mid+'" y="'+(y+12)+'" class="label" text-anchor="middle">'+esc(v.label)+'</text>';}).join('');
 const ticks=[0,.25,.5,.75,1].map(p=>(p===0?[mid]:[mid-span*p,mid+span*p]).map(x=>'<line class="axis" x1="'+x+'" y1="24" x2="'+x+'" y2="453"/><text x="'+x+'" y="475" class="ticks" text-anchor="middle">'+n(p*max)+'</text>').join('')).join('');
 const measure=scale==='percent'?'Porcentaje del total (%)':'Efectivos de población';
 $('chart'+side).innerHTML='<svg xmlns="http://www.w3.org/2000/svg" role="img" focusable="false" aria-labelledby="pyramid-title-'+side+' pyramid-description-'+side+'" viewBox="0 0 580 510" class="pyramid"><title id="pyramid-title-'+side+'">Pirámide '+side+' · '+esc(d.meta.place)+' · '+esc(d.meta.year)+'</title><desc id="pyramid-description-'+side+'">'+measure+'. Hombres a la izquierda y mujeres a la derecha. La tabla por edad y sexo ofrece los valores de cada barra.</desc><text x="161" y="13" text-anchor="middle" class="ticks">Hombres</text><text x="422" y="13" text-anchor="middle" class="ticks">Mujeres</text>'+ticks+rects+'<text x="290" y="503" class="ticks" text-anchor="middle">'+measure+'</text></svg>';
}
function renderMeta(d,side){
 const m=d.meta,slot=$('meta'+side);
 const p=document.createElement('p');p.textContent='Fuente: '+m.provider+' · tabla '+(m.table||'consultar ficha')+' · '+m.place+' · '+m.year+' · referencia '+m.referenceDate+' · unidad: personas · actualización: '+m.updatedAt;
 const source=document.createElement('p'),link=document.createElement('a');link.href=m.sourceUrl;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Ficha estadística y metadatos de origen ↗';source.append(link);
 const note=document.createElement('p');note.textContent=m.note||'Datos oficiales, comprobar notas metodológicas.';
 slot.replaceChildren(p,source,note);
}
function renderStats(d,side){const i=indicators(d);$('stats'+side).innerHTML=labels.map(([key,label,unit])=>'<div class="stat"><strong>'+n(i[key])+'</strong><span>'+esc(label)+' · '+esc(unit)+'</span></div>').join('');}
function renderTable(d,side){
 const value=count=>countShare(count,100*count/d.total);
 $('table'+side).innerHTML='<table class="data-table"><caption>'+esc(d.meta.provider+' · '+d.meta.place+' · '+d.meta.year)+' · porcentajes sobre el total de la pirámide</caption><thead><tr><th scope="col">Edad</th><th scope="col">Hombres</th><th scope="col">Mujeres</th><th scope="col">Total</th></tr></thead><tbody>'+
  d.cohorts.map(b=>'<tr><th scope="row">'+esc(b.label)+'</th><td>'+value(b.m)+'</td><td>'+value(b.f)+'</td><td>'+value(b.m+b.f)+'</td></tr>').join('')+'</tbody></table>';
}
function renderDesc(d,side){const info=describe(d);$('desc'+side).innerHTML='<span class="type-badge">'+esc(info.title)+'</span><h4>Lectura morfológica y estadística</h4>'+info.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('');}
function refreshCharts(){
 const scale=$('view').value,focus=$('focus').value,max=maxShared(scale);
 const differences=focus==='diff'&&state.A&&state.B?compareCohorts(state.A,state.B).largestThree.map(row=>row.label):[];
 for(const side of ['A','B'])if(state[side])chart(state[side],side,scale,focus,max,differences);
}
function showDataset(side,dataset,message){
 state[side]=dataset;
 setStatus(side,message);
 renderMeta(dataset,side);
 renderStats(dataset,side);
 renderTable(dataset,side);
 renderDesc(dataset,side);
 refreshCharts();
 resultReset();
 updateButtons();
}
function comparisonReadout(){
 if(!state.A||!state.B)return null;
 const academic=academicComparison(state.A,state.B);
 const indicators=compare(state.A,state.B).rows
  .filter(row=>row.unit!=='puntos porcentuales')
  .map(row=>({...row,delta:row.delta===null?null:academic.context.sign*row.delta}));
 const summary=$('readingMode')?.value==='summary',wanted=summary?new Set(['identificacion','morfologia','edades','contexto','conclusion']):null;
 const sections=academic.sections.filter(s=>!wanted||wanted.has(s.id));
 return {indicators,academic,sections,summary};
}
const ageLabel=label=>label==='85+'?'85+ abierto':label;

function ageTable(rows,context,showSex=false){
 const caption=(showSex?'Comparación por edad y sexo':'Recuentos y peso por grandes grupos de edad')+
  ' · diferencia como '+context.equation;
 const sexColumns=showSex?'<th scope="col">Diferencia hombres (puntos porcentuales)</th><th scope="col">Diferencia mujeres (puntos porcentuales)</th>':'';
 return '<div class="scroll" tabindex="0" role="region" aria-label="'+(showSex?'Comparación por intervalos de edad':'Comparación por grandes grupos de edad')+'">'+
  '<table class="comparison-table '+(showSex?'cohort-table':'age-group-table')+'"><caption>'+esc(caption)+'</caption>'+
  '<thead><tr><th scope="col">Edad</th><th scope="col">A</th><th scope="col">B</th><th scope="col">Diferencia total</th>'+sexColumns+'</tr></thead><tbody>'+
  rows.map(row=>'<tr><th scope="row">'+esc(ageLabel(row.label))+'</th><td>'+countShare(row.countA,row.a)+'</td><td>'+countShare(row.countB,row.b)+'</td>'+
   '<td><span class="count-share">'+signed(row.countDelta,0)+' personas</span><span class="count-share">'+signed(row.delta)+' pp</span></td>'+
   (showSex?'<td>'+signed(row.menDelta)+'</td><td>'+signed(row.womenDelta)+'</td>':'')+'</tr>').join('')+'</tbody></table></div>';
}

function differenceChart(rows,context){
 const maximum=Math.max(...rows.flatMap(row=>[Math.abs(row.menDelta),Math.abs(row.womenDelta)]));
 const limit=Math.max(.1,Math.ceil(maximum*10)/10);
 const bars=[...rows].reverse().map(row=>
  [['m','H',row.menDelta],['f','M',row.womenDelta]].map(([sex,short,value],index)=>{
   const width=50*Math.abs(value)/limit;
   const start=value<0?50-width:50;
   const className=index===0?' contrast-age-start'+(row.label==='85+'?' contrast-open-age':''):'';
   return '<div class="contrast-row'+className+'"><strong class="contrast-age-label">'+(index===0?esc(ageLabel(row.label)):'')+'</strong>'+
    '<span class="contrast-sex">'+short+'</span><div class="contrast-track">'+
    '<span class="contrast-bar contrast-bar-'+sex+'" style="--bar-start:'+start+'%;--bar-width:'+width+'%"></span></div>'+
    '<strong class="contrast-value">'+signed(value)+'</strong></div>';
  }).join('')).join('');
 return '<div class="contrast-visual"><h4>Diferencias por edad y sexo</h4>'+
  '<p>Cada barra compara el peso de un grupo de edad y sexo sobre el total de su pirámide. A la izquierda del cero hay '+esc(context.negative)+
  ' y a la derecha hay '+esc(context.positive)+'. H indica hombres y M indica mujeres. Los valores se expresan en puntos porcentuales.</p>'+
  '<p><a id="contrast-table-link" href="#comparison-age-summary">Ir a la tabla completa por edad y sexo</a></p>'+
  '<div id="contrast-chart" class="contrast-chart" aria-hidden="true"><div class="contrast-row contrast-axis"><strong>Edad</strong><span></span>'+
  '<div class="contrast-axis-scale"><span>'+signed(-limit)+'</span><span>0</span><span>'+signed(limit)+'</span></div>'+
  '<strong class="contrast-value">pp</strong></div>'+bars+'</div></div>';
}

function showComparison(){
 const data=comparisonReadout();if(!data)return;
 const {indicators,academic,sections}=data,{context,cohorts:c}=academic;
 const detailsOpen=!document.documentElement.hasAttribute('data-tables')&&$('results').querySelector('.cohorts-detail')?.open;
 const table='<div class="scroll" tabindex="0" role="region" aria-label="Indicadores comparados"><table class="comparison-table"><caption>Indicadores demográficos · diferencia como '+esc(context.equation)+'</caption><thead><tr><th scope="col">Indicador</th><th scope="col">A</th><th scope="col">B</th><th scope="col">Diferencia</th></tr></thead><tbody>'+
 indicators.map(row=>'<tr><th scope="row">'+esc(row.label)+'</th><td>'+n(row.a)+'</td><td>'+n(row.b)+'</td><td>'+signed(row.delta,row.unit==='personas'?0:2)+(row.delta===null?'':' <small>'+esc(row.unit)+'</small>')+'</td></tr>').join('')+'</tbody></table></div>';
 const reading='<div class="academic-head"><h4>Comentario comparado fundamentado</h4><span class="academic-length">'+academic.wordCount+' palabras en el informe íntegro · '+(data.summary?'síntesis':'lectura detallada')+'</span></div>'+
 '<div class="academic-reading">'+sections.map(s=>'<section class="academic-section" aria-labelledby="reading-'+s.id+'"><h5 id="reading-'+s.id+'">'+esc(s.title)+'</h5><p>'+esc(s.text)+'</p></section>').join('')+'</div>';
 const detail='<details class="cohorts-detail" data-data-table'+(detailsOpen?' open':'')+'><summary id="comparison-age-summary">Tabla completa por edad y sexo (17 grupos quinquenales y 85+ abierto)</summary>'+
  '<p>Las diferencias de hombres y mujeres se expresan en puntos porcentuales del total de su pirámide.</p>'+
  ageTable(c.rows,context,true)+'</details>';
 const cautions='<div class="reading-notes" aria-label="Limitaciones metodológicas"><h4>Alcance del análisis</h4>'+
 academic.caution.map(x=>'<p>'+esc(x)+'</p>').join('')+'</div>';
 const highlights=c.largestThree.length
  ? '<div class="reading-notes"><h4>Cohortes con mayor diferencia (intervalos quinquenales cerrados)</h4><p>'+
    c.largestThree.map(r=>esc(r.label)+' ('+signed(r.delta)+' puntos porcentuales)').join(' · ')+
    '. Utiliza el filtro «Diferencias A/B» para destacarlas en ambas pirámides.</p></div>'
  : '<div class="reading-notes"><h4>Diferencias entre grupos quinquenales</h4><p>Los contrastes de los 17 intervalos cerrados redondean a 0,00 puntos porcentuales.</p></div>';
 $('results').innerHTML='<h3 id="comparison-result-title" tabindex="-1">Comparación de estructuras poblacionales</h3>'+
  '<p>Los porcentajes se calculan sobre el total de cada pirámide. Las diferencias de proporción se expresan en puntos porcentuales (pp). Las tablas y el gráfico usan '+esc(context.equation)+'.</p>'+
  ageTable(academic.ageGroups,context)+differenceChart(c.rows,context)+detail+table+highlights+reading+cautions;
 $('contrast-table-link').addEventListener('click',event=>{
  event.preventDefault();
  const summary=$('comparison-age-summary');
  summary.parentElement.open=true;
  summary.focus();
 });
}
function exportText(){
 const data=comparisonReadout();if(!data)return '';
 const {academic,indicators,sections}=data,{context}=academic;
 const ageLine=row=>ageLabel(row.label)+' | A · '+n(row.countA)+' personas, '+share(row.a)+
  ' | B · '+n(row.countB)+' personas, '+share(row.b)+' | Diferencia · '+signed(row.countDelta,0)+' personas, '+signed(row.delta)+' pp';
 return ['ESTRUCTURA SOCIAL · LECTURA ACADÉMICA DE DOS PIRÁMIDES',new Date().toLocaleDateString('es-ES'),
 ...['A','B'].flatMap(side=>{
  const m=state[side].meta;
  return ['\nFUENTE '+side+' · '+m.provider+' · '+m.place+' · '+m.referenceDate+' · tabla '+m.table,
   'Ficha estadística · '+m.sourceUrl,'Actualización · '+m.updatedAt,m.note];
 }),
 '\n'+context.heading.toLocaleUpperCase('es-ES'),context.summary,...context.warnings,
 '\nRECUENTOS Y PESO POR GRANDES GRUPOS DE EDAD',
 ...academic.ageGroups.map(ageLine),
 '\nINDICADORES COMPARADOS · '+context.equation.toLocaleUpperCase('es-ES'),
 ...indicators.map(x=>x.label+' | A · '+n(x.a)+' | B · '+n(x.b)+' | Diferencia · '+signed(x.delta,x.unit==='personas'?0:2)+(x.delta===null?'':' '+x.unit)),
 '\nLECTURA COMPARADA',
 ...sections.map(s=>s.title+'\n'+s.text+'\n'),
 '\nGRUPOS DE EDAD (17 QUINQUENALES Y 85+ ABIERTO) · porcentajes sobre el total de cada pirámide',
 ...academic.cohorts.rows.map(row=>ageLine(row)+' | Diferencia hombres · '+signed(row.menDelta)+' pp | Diferencia mujeres · '+signed(row.womenDelta)+' pp'),
 '\nLÍMITES METODOLÓGICOS',...academic.caution,
 'Lectura morfológica basada en los materiales de Estructura Social consultados en el proyecto (base, tronco, cúspide y comparación de cohortes).',
 'Las afirmaciones de causalidad demográfica o desigualdad social requieren evidencia adicional.'].join('\n');
}
function download(name,content,mime){
 const url=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),800);
}
function types(){
 const container=$('typeCards');
 container.innerHTML=MODELS.map(m=>'<article class="type-card"><div class="type-figure" data-model="'+esc(m.id)+'" aria-hidden="true"></div>'+
  '<div class="type-content"><p class="model-kind">'+esc(m.kind)+'</p><h3>'+esc(m.title)+'</h3><p>'+esc(m.detail)+'</p>'+
  '<p class="qualification">'+esc(m.limit)+'</p></div></article>').join('');
 for(const element of container.querySelectorAll('.type-figure')){
  const model=MODELS.find(m=>m.id===element.dataset.model);
  const rects=model.weights.map((v,i)=>{
   const y=7+(17-i)*7.7,left=v*100,right=v*100*(model.id==='asimetria'?(i>=13?1.45:1.08):1);
   return '<rect x="'+(130-left)+'" y="'+y+'" width="'+left+'" height="6" fill="#61b2d9"/>'+
    '<rect x="130" y="'+y+'" width="'+right+'" height="6" fill="#e28aa7"/>';
  }).join('');
  element.innerHTML='<svg viewBox="0 0 280 155" role="presentation" focusable="false"><line x1="130" x2="130" y1="0" y2="155" stroke="#d6ecf1" opacity=".6"/>'+rects+'</svg>';
 }
}
function init(){
 types();
 select($('formA'),'provider').value='ine';
 const configure={A:setupForm('A',2001),B:setupForm('B',2025)};
 $('view').addEventListener('change',refreshCharts);
 $('focus').addEventListener('change',refreshCharts);
 $('swap').addEventListener('click',async()=>{
  const hadComparison=Boolean($('comparison-result-title'));
  const snapshot=side=>{
   const form=$('form'+side);
   return {source:select(form,'provider').value,place:select(form,'place').value,year:select(form,'year').value,data:state[side]};
  };
  const left=snapshot('A'),right=snapshot('B');
  const apply=async(side,selection)=>{
   const pending=configure[side](selection.source,selection.place,selection.year);
   const revision=state.revision[side];
   await pending;
   if(selection.data&&revision===state.revision[side]&&select($('form'+side),'year').value===selection.year){
    showDataset(side,selection.data,'Datos oficiales intercambiados.');
   }
  };
  await Promise.all([apply('A',right),apply('B',left)]);
  if(hadComparison&&state.A&&state.B)showComparison();
 });
 $('analyze').addEventListener('click',()=>{
  showComparison();
  $('comparison-announcement').textContent='Comparación calculada.';
  $('comparison-result-title')?.focus();
 });
 $('readingMode').addEventListener('change',()=>{if(state.A&&state.B)showComparison();});
 $('export').addEventListener('click',()=>download('comparacion-estructura-social.txt',exportText(),'text/plain;charset=utf-8'));
 $('exportCSV').addEventListener('click',()=>download('piramides-A-y-B.csv','Piramide;Fuente;Territorio;Año;Edad;Hombres;Mujeres\n'+['A','B'].flatMap(side=>state[side].cohorts.map(row=>[side,state[side].meta.provider,state[side].meta.place,state[side].meta.year,row.label,row.m,row.f].join(';'))).join('\n')+'\n','text/csv;charset=utf-8'));
 $('print').addEventListener('click',()=>{
  if(!$('results').querySelector('.academic-reading'))showComparison();
  window.print();
 });
 const openedForPrint=new Set();
 window.addEventListener('beforeprint',()=>{
  for(const detail of document.querySelectorAll('#comparador details:not([open])')){
   openedForPrint.add(detail);
   detail.open=true;
  }
 });
 window.addEventListener('afterprint',()=>{
  for(const detail of openedForPrint)detail.open=false;
  openedForPrint.clear();
 });
 const initialBRevision=state.revision.B;
 Promise.all([load('A'),state.catalogPromise.B.then(()=>{if(state.revision.B===initialBRevision&&select($('formB'),'year').value)return load('B');})]).then(()=>{if(state.A&&state.B)showComparison();});
 if('serviceWorker' in navigator && location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
init();
