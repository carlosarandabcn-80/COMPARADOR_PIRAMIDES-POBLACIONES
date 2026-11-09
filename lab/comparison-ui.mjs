import {COUNTRIES,indicators,status,describe,compare,eurostatURL,fromEurostat,parseINE,INE_TERRITORIES,ineTerritoryURL,parseINETerritory,IDESCAT_TERRITORIES,parseIdescatSnapshot} from './comparison-core.mjs';
import {MODELS} from './morphology.mjs';
import {academicComparison,compareCohorts} from './academic-reading.mjs';
const $=id=>document.getElementById(id),format=new Intl.NumberFormat('es-ES',{maximumFractionDigits:2}),n=x=>x===null?'No calculable':format.format(x);
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
 $('form'+side).querySelector('button[type=submit]').disabled=select($('form'+side),'year').disabled;
 $('status'+side).textContent='Selecciona el periodo y carga datos oficiales.';
 $('status'+side).className='status';
 $('chart'+side).innerHTML='<div class="placeholder">Sin datos cargados para esta selección.</div>';
 for(const id of ['meta','stats','table','desc'])$(id+side).replaceChildren();
 if(hadData)refreshCharts();
 resultReset();
 updateButtons();
}
function resultReset(){$('results').innerHTML='<h3>Resultado comparativo</h3><p>Selecciona dos fuentes y periodos y pulsa «Comparar estructuras A y B».</p>';}
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
 if(period.disabled||!period.value)return;
 const provider=select(f,'provider').value,place=select(f,'place').value,year=Number(period.value);
 clear(side);const revision=state.revision[side],controller=new AbortController();state.controllers[side]=controller;
 const button=f.querySelector('button[type=submit]');button.disabled=true;
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
 }finally{if(revision===state.revision[side]){state.controllers[side]=null;button.disabled=false;}}
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
 const ticks=[0,.25,.5,.75,1].map(p=>[mid-span*p,mid+span*p].map(x=>'<line class="axis" x1="'+x+'" y1="24" x2="'+x+'" y2="453" opacity=".18"/><text x="'+x+'" y="475" class="ticks" text-anchor="middle">'+n(p*max)+'</text>').join('')).join('');
 $('chart'+side).innerHTML='<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc('Pirámide real '+side+' de '+d.meta.place+', '+d.meta.year+'. La tabla contiene los datos exactos.')+'" viewBox="0 0 580 510" class="pyramid"><title>Pirámide '+side+' · '+esc(d.meta.place)+' · '+esc(d.meta.year)+'</title><text x="161" y="13" text-anchor="middle" class="ticks">Hombres</text><text x="422" y="13" text-anchor="middle" class="ticks">Mujeres</text>'+ticks+rects+'<text x="290" y="503" class="ticks" text-anchor="middle">'+(scale==='percent'?'Porcentaje del total (%)':'Efectivos de población')+'</text></svg>';
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
 $('table'+side).innerHTML='<table class="data-table"><caption>'+esc(d.meta.provider+' · '+d.meta.place+' · '+d.meta.year)+'</caption><thead><tr><th scope="col">Edad</th><th scope="col">Hombres</th><th scope="col">Mujeres</th><th scope="col">Total</th></tr></thead><tbody>'+d.cohorts.map(b=>'<tr><th scope="row">'+esc(b.label)+'</th><td>'+n(b.m)+'</td><td>'+n(b.f)+'</td><td>'+n(b.m+b.f)+'</td></tr>').join('')+'</tbody></table>';
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
 const numerical=compare(state.A,state.B),academic=academicComparison(state.A,state.B);
 const summary=$('readingMode')?.value==='summary',wanted=summary?new Set(['identificacion','morfologia','edades','contexto','conclusion']):null;
 const sections=academic.sections.filter(s=>!wanted||wanted.has(s.id));
 return {numerical,academic,sections,summary};
}
function showComparison(){
 const data=comparisonReadout();if(!data)return;
 const {numerical,academic,sections}=data;
 const table='<div class="scroll" tabindex="0" role="region" aria-label="Indicadores comparados"><table class="comparison-table"><caption>Indicadores A menos B · diferencia expresada en unidades indicadas</caption><thead><tr><th scope="col">Indicador</th><th scope="col">A</th><th scope="col">B</th><th scope="col">Diferencia</th></tr></thead><tbody>'+
 numerical.rows.map(row=>'<tr><th scope="row">'+esc(row.label)+'</th><td>'+n(row.a)+'</td><td>'+n(row.b)+'</td><td>'+(row.delta>0?'+':'')+n(row.delta)+' <small>'+esc(row.unit)+'</small></td></tr>').join('')+'</tbody></table></div>';
 const reading='<div class="academic-head"><h4>Comentario comparado fundamentado</h4><span class="academic-length">'+academic.wordCount+' palabras en el informe íntegro · '+(data.summary?'síntesis':'lectura detallada')+'</span></div>'+
 '<div class="academic-reading">'+sections.map(s=>'<section class="academic-section" aria-labelledby="reading-'+s.id+'"><h5 id="reading-'+s.id+'">'+esc(s.title)+'</h5><p>'+esc(s.text)+'</p></section>').join('')+'</div>';
 const c=academic.cohorts,detail='<details class="cohorts-detail"><summary>Contrastar todos los intervalos de edad (17 quinquenales y 85+ abierto)</summary><div class="scroll" tabindex="0" role="region" aria-label="Comparación por intervalos de edad">'+
 '<table class="comparison-table"><caption>Peso por grupo de edad (85+ es intervalo abierto)</caption><thead><tr><th scope="col">Edad</th><th scope="col">A (%)</th><th scope="col">B (%)</th><th scope="col">A−B (pp)</th></tr></thead><tbody>'+
 c.rows.map(row=>'<tr><th scope="row">'+esc(row.label)+'</th><td>'+n(row.a)+'</td><td>'+n(row.b)+'</td><td>'+(row.delta>0?'+':'')+n(row.delta)+'</td></tr>').join('')+
 '</tbody></table></div></details>';
 const cautions='<div class="reading-notes" aria-label="Limitaciones metodológicas"><h4>Alcance del análisis</h4>'+
 academic.caution.map(x=>'<p>'+esc(x)+'</p>').join('')+'</div>';
 const highlights=c.largestThree.length
  ? '<div class="reading-notes"><h4>Cohortes con mayor diferencia (intervalos quinquenales cerrados)</h4><p>'+
    c.largestThree.map(r=>esc(r.label)+' ('+(r.delta>0?'+':'')+n(r.delta)+' puntos porcentuales A−B)').join(' · ')+
    '. Utiliza el filtro «Diferencias A/B» para destacarlas simultáneamente en ambas pirámides.</p></div>'
  : '<div class="reading-notes"><h4>Diferencias entre grupos quinquenales</h4><p>Los contrastes de los 17 intervalos cerrados redondean a 0,00 puntos porcentuales.</p></div>';
 $('results').innerHTML='<h3>Comparación de estructuras poblacionales</h3>'+table+highlights+reading+detail+cautions;
}
function exportText(){
 const data=comparisonReadout();if(!data)return '';
 const {academic,numerical,sections}=data;
 return ['ESTRUCTURA SOCIAL · LECTURA ACADÉMICA DE DOS PIRÁMIDES',new Date().toLocaleDateString('es-ES'),
 ...['A','B'].flatMap(side=>{
  const m=state[side].meta;
  return ['\nFUENTE '+side+' · '+m.provider+' · '+m.place+' · '+m.referenceDate+' · tabla '+m.table,
   'Ficha estadística · '+m.sourceUrl,'Actualización · '+m.updatedAt,m.note];
 }),
 '\nINDICADORES COMPARADOS A MENOS B',
 ...numerical.rows.map(x=>x.label+' | A: '+n(x.a)+' | B: '+n(x.b)+' | diferencia: '+n(x.delta)+' '+x.unit),
 '\nLECTURA COMPARADA',
 ...sections.map(s=>s.title+'\n'+s.text+'\n'),
 '\nGRUPOS DE EDAD (17 QUINQUENALES Y 85+ ABIERTO) · porcentajes sobre el total; diferencia en puntos porcentuales',
 ...academic.cohorts.rows.map(x=>x.label+' | A: '+n(x.a)+' % | B: '+n(x.b)+' % | A−B: '+n(x.delta)+' pp'),
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
 });
 $('analyze').addEventListener('click',showComparison);
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
