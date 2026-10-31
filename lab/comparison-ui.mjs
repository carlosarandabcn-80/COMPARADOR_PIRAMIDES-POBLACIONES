import {BANDS,COUNTRIES,SOURCES,check,indicators,status,describe,compare,eurostatURL,fromEurostat,ineURL,parseINE,INE_TERRITORIES,ineTerritoryURL,parseINETerritory,serializeCSV} from './comparison-core.mjs';
import {MODELS} from './morphology.mjs';
import {academicComparison} from './academic-reading.mjs';
const $=id=>document.getElementById(id),format=new Intl.NumberFormat('es-ES',{maximumFractionDigits:2}),n=x=>x===null?'No calculable':format.format(x);
const esc=s=>String(s).replace(/[&<>"']/g,v=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[v]));
const state={A:null,B:null,loading:{A:false,B:false},revision:{A:0,B:0},controllers:{A:null,B:null},catalogVersion:{A:0,B:0},catalogPromise:{A:null,B:null}};
const eurostatArchives=new Map();
let swapSerial=0;
const INE_PLACES=Object.fromEntries(Object.entries(INE_TERRITORIES).map(([key,v])=>[key,v.title]));
const labels=[['pYouth','0–14 años','%'],['pActive','15–64 años','%'],['pOld','65+ años','%'],['ageing','Índice envejecimiento','65+/0–14 × 100'],['dependency','Dependencia demográfica','(0–14 + 65+) / 15–64 × 100'],['total','Población total','personas']];
const select=(form,key)=>form.elements.namedItem(key);
function setupForm(side,defYear){
 const f=$('form'+side),provider=select(f,'provider'),place=select(f,'place'),year=select(f,'year');
 const refresh=()=>{const euro=provider.value==='eurostat';place.replaceChildren();for(const [code,name] of Object.entries(euro?COUNTRIES:INE_PLACES)){const opt=new Option(name,code);place.add(opt);}
 place.value='ES';year.replaceChildren();for(let y=(euro?2025:INE_TERRITORIES.ES.end);y>=(euro?1960:INE_TERRITORIES.ES.start);y--)year.add(new Option(String(y),String(y)));
 year.value=String(defYear);clear(side);state.catalogVersion[side]++;state.catalogPromise[side]=euro?ensureYears(side):Promise.resolve();};
 provider.addEventListener('change',refresh);
 place.addEventListener('change',()=>{
 clear(side);
 if(provider.value==='ine'){
  state.catalogVersion[side]++;
  const t=INE_TERRITORIES[place.value];
  year.replaceChildren(...Array.from({length:t.end-t.start+1},(_,i)=>new Option(String(t.end-i),String(t.end-i))));
  state.catalogPromise[side]=Promise.resolve();
  setStatus(side,'Tabla territorial INE '+t.table+' · '+t.title+'. Disponibilidad sujeta a la API oficial.');
 }else state.catalogPromise[side]=ensureYears(side);
});
 year.addEventListener('change',()=>clear(side));
 f.addEventListener('submit',e=>{e.preventDefault();load(side);});
 refresh();
}
function clear(side){state.revision[side]++;state.controllers[side]?.abort();state.controllers[side]=null;state.loading[side]=false;const button=$('form'+side).querySelector('button[type=submit]');if(button)button.disabled=false;state[side]=null;$('status'+side).textContent='Selecciona el periodo y carga datos oficiales.';$('status'+side).className='status';$('chart'+side).innerHTML='<div class="placeholder">Sin datos cargados para esta selección.</div>';$('meta'+side).replaceChildren();$('stats'+side).replaceChildren();$('table'+side).replaceChildren();$('desc'+side).replaceChildren();resultReset();updateButtons();}
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
 const years=Object.keys(json?.dimension?.time?.category?.index||{}).map(Number).filter(y=>Number.isInteger(y)&&y>=1960&&y<=2025).sort((a,b)=>b-a);
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
 const form=$('form'+side),provider=select(form,'provider'),country=select(form,'place'),year=select(form,'year'),button=form.querySelector('button[type=submit]');
 if(provider.value!=='eurostat')return;
 const code=country.value,previous=year.value,token=++state.catalogVersion[side];
 year.disabled=true;button.disabled=true;setStatus(side,'Consultando los años con pirámides completas para '+country.selectedOptions[0].textContent+'…');
 try{
  const archive=await getEurostatArchive(code);
  if(state.catalogVersion[side]!==token||provider.value!=='eurostat'||country.value!==code)return;
  const available=availableEurostatYears(archive,code);
  if(!available.length){year.replaceChildren();setStatus(side,'La API no ofrece pirámides quinquenales completas para este territorio.',true);return;}
  year.replaceChildren(...available.map(y=>new Option(String(y),String(y))));
  year.value=available.includes(Number(previous))?previous:String(available[0]);
  if(year.value!==previous)clear(side);
  setStatus(side,'Años comprobados con datos oficiales: '+available.length+'. Selecciona uno y carga la pirámide.');
 }catch(err){
  if(state.catalogVersion[side]===token&&provider.value==='eurostat'&&country.value===code){
   setStatus(side,'No se ha podido consultar el catálogo de años ('+err.message+'). Puedes intentar cargar directamente el año seleccionado.',true);
  }
 }finally{
  if(state.catalogVersion[side]===token &&provider.value==='eurostat'&&country.value===code){year.disabled=year.options.length===0;button.disabled=state.loading[side]||year.options.length===0;}
 }
}
async function load(side){
 const f=$('form'+side),provider=select(f,'provider').value,place=select(f,'place').value,year=Number(select(f,'year').value);
 clear(side);const revision=state.revision[side],controller=new AbortController();state.controllers[side]=controller;state.loading[side]=true;
 const button=f.querySelector('button[type=submit]');button.disabled=true;
 setStatus(side,'Consultando '+(provider==='ine'?'INE':'Eurostat')+' · '+year+'. Obteniendo únicamente datos oficiales…');
 try{
  let dataset;
  if(provider==='eurostat')dataset=fromEurostat(await (eurostatArchives.get(place) || getJSON(eurostatURL(place,year),35000,controller.signal)),place,year);
  else if(place==='ES')dataset=parseINE(await getJSON(ineURL(year),90000,controller.signal),year);
  else dataset=parseINETerritory(await getJSON(ineTerritoryURL(place,year),90000,controller.signal),place,year);
  if(revision!==state.revision[side])return;
  state[side]=dataset;setStatus(side,'Datos oficiales cargados y validados. '+dataset.meta.provider+' · '+dataset.meta.place+' · '+year+'.');
  refreshCharts();resultReset();updateButtons();
 }catch(error){if(revision===state.revision[side])setStatus(side,'No se han podido obtener datos válidos: '+(error.name==='AbortError'?'La consulta ha superado el tiempo disponible.':error.message)+'. Comprueba la fuente y vuelve a intentarlo. Nunca se sustituyen los datos por modelos ficticios.',true);}
 finally{if(revision===state.revision[side]){state.loading[side]=false;state.controllers[side]=null;button.disabled=false;}}
}
function topDifferences(){
 if(!state.A||!state.B)return [];
 return Array.from({length:17},(_,i)=>({
 i,delta:Math.abs(100*(state.A.cohorts[i].m+state.A.cohorts[i].f)/state.A.total-
 100*(state.B.cohorts[i].m+state.B.cohorts[i].f)/state.B.total)
 })).sort((a,b)=>b.delta-a.delta||a.i-b.i).slice(0,3).map(v=>v.i);
}
function maxShared(scale){
 const arr=[state.A,state.B].filter(Boolean),values=arr.flatMap(d=>d.cohorts.flatMap(b=>scale==='percent'?[b.m/d.total*100,b.f/d.total*100]:[b.m,b.f]));
 return Math.max(.01,...values);
}
function chart(d,side,scale,focus,max){
 const {total}=d,mid=290,span=211,top=30,row=23.4;
 const differences=focus==='diff'&&state.A&&state.B?topDifferences():[];
 const active=i=>focus==='all'||(focus==='young'&&i<3)||(focus==='adult'&&i>=3&&i<13)||(focus==='old'&&i>=13)||(focus==='diff'&&differences.includes(i));
 const rects=d.cohorts.map((v,i)=>{const a=scale==='percent'?v.m*100/total:v.m,b=scale==='percent'?v.f*100/total:v.f,
  mw=span*a/max,fw=span*b/max,y=top+(17-i)*row;
  return '<rect x="'+(mid-mw)+'" y="'+y+'" width="'+mw+'" height="17" class="bar-m'+(active(i)?'':' dim')+'"><title>'+esc(v.label)+' · hombres '+n(v.m)+'</title></rect>'+
   '<rect x="'+mid+'" y="'+y+'" width="'+fw+'" height="17" class="bar-f'+(active(i)?'':' dim')+'"><title>'+esc(v.label)+' · mujeres '+n(v.f)+'</title></rect>'+
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
 for(const side of ['A','B']){const d=state[side];if(!d)continue;chart(d,side,scale,focus,max);renderMeta(d,side);renderStats(d,side);renderTable(d,side);renderDesc(d,side);}
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
 const table='<div class="scroll"><table class="comparison-table"><caption>Indicadores A menos B · diferencia expresada en unidades indicadas</caption><thead><tr><th scope="col">Indicador</th><th scope="col">A</th><th scope="col">B</th><th scope="col">Diferencia</th></tr></thead><tbody>'+
 numerical.rows.map(row=>'<tr><th scope="row">'+esc(row.label)+'</th><td>'+n(row.a)+'</td><td>'+n(row.b)+'</td><td>'+(row.delta>0?'+':'')+n(row.delta)+' <small>'+esc(row.unit)+'</small></td></tr>').join('')+'</tbody></table></div>';
 const reading='<div class="academic-head"><h4>Comentario comparado fundamentado</h4><span class="academic-length">'+academic.wordCount+' palabras en el informe íntegro · '+(data.summary?'síntesis':'lectura detallada')+'</span></div>'+
 '<div class="academic-reading">'+sections.map(s=>'<section class="academic-section" aria-labelledby="reading-'+s.id+'"><h5 id="reading-'+s.id+'">'+esc(s.title)+'</h5><p>'+esc(s.text)+'</p></section>').join('')+'</div>';
 const c=academic.cohorts,detail='<details class="cohorts-detail"><summary>Contrastar todos los intervalos de edad (17 quinquenales y 85+ abierto)</summary><div class="scroll">'+
 '<table class="comparison-table"><caption>Peso por grupo de edad (85+ es intervalo abierto)</caption><thead><tr><th scope="col">Edad</th><th scope="col">A (%)</th><th scope="col">B (%)</th><th scope="col">A−B (pp)</th></tr></thead><tbody>'+
 c.rows.map(row=>'<tr><th scope="row">'+esc(row.label)+'</th><td>'+n(row.a)+'</td><td>'+n(row.b)+'</td><td>'+(row.delta>0?'+':'')+n(row.delta)+'</td></tr>').join('')+
 '</tbody></table></div></details>';
 const cautions='<div class="reading-notes" aria-label="Limitaciones metodológicas"><h4>Alcance del análisis</h4>'+
 academic.caution.map(x=>'<p>'+esc(x)+'</p>').join('')+'</div>';
 const highlights='<div class="reading-notes"><h4>Tres cohortes con mayor diferencia (intervalos quinquenales cerrados)</h4><p>'+
  topDifferences().map(i=>{const r=c.rows[i];return esc(r.label)+' ('+(r.delta>0?'+':'')+n(r.delta)+' puntos porcentuales A−B)';}).join(' · ')+
  '. Utiliza el filtro «Diferencias A/B» para destacarlas simultáneamente en ambas pirámides.</p></div>';
 $('results').innerHTML='<h3>Comparación de estructuras poblacionales</h3>'+table+highlights+reading+detail+cautions;
}
function exportText(){
 const data=comparisonReadout();if(!data)return '';
 const {academic,numerical,sections}=data,a=state.A,b=state.B;
 return ['ESTRUCTURA SOCIAL · LECTURA ACADÉMICA DE DOS PIRÁMIDES',new Date().toLocaleDateString('es-ES'),
 '\nFUENTE A: '+a.meta.provider+' · '+a.meta.place+' · '+a.meta.year,
 'Ficha estadística: '+a.meta.sourceUrl,'Actualización fuente: '+a.meta.updatedAt,
 '\nFUENTE B: '+b.meta.provider+' · '+b.meta.place+' · '+b.meta.year,
 'Ficha estadística: '+b.meta.sourceUrl,'Actualización fuente: '+b.meta.updatedAt,
 '\nINDICADORES COMPARADOS A MENOS B',
 ...numerical.rows.map(x=>x.label+' | A: '+n(x.a)+' | B: '+n(x.b)+' | diferencia: '+n(x.delta)+' '+x.unit),
 '\nLECTURA COMPARADA',
 ...sections.map(s=>s.title+'\n'+s.text+'\n'),
 '\nGRUPOS DE EDAD (17 QUINQUENALES Y 85+ ABIERTO) · porcentajes sobre el total; diferencia en puntos porcentuales',
 ...academic.cohorts.rows.map(x=>x.label+' | A: '+n(x.a)+' % | B: '+n(x.b)+' % | A−B: '+n(x.delta)+' pp'),
 '\nLÍMITES METODOLÓGICOS',...academic.caution,
 '\nMetodología: '+SOURCES.ine.url+' | '+SOURCES.eurostat.url,
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
function restoreForm(side){
 const f=$('form'+side),provider=select(f,'provider'),country=select(f,'place'),year=select(f,'year');
 const source=provider.value,geography=country.value,date=year.value;
 const other=side==='A'?'B':'A',g=$('form'+other);
 select(g,'provider').value=source;select(g,'provider').dispatchEvent(new Event('change'));
 select(g,'place').value=geography;select(g,'year').value=date;
}
function init(){
 types();select($('formA'),'provider').value='ine';setupForm('A',2001);setupForm('B',2025);
 $('view').addEventListener('change',refreshCharts);
 $('focus').addEventListener('change',refreshCharts);
 $('swap').addEventListener('click',async()=>{
  const token=++swapSerial,formA=$('formA'),formB=$('formB'),oldA=state.A,oldB=state.B;
  const snapshot=form=>({p:select(form,'provider').value,l:select(form,'place').value,y:select(form,'year').value});
  const left=snapshot(formA),right=snapshot(formB);
  const apply=(side,v)=>{
   const f=$('form'+side);
   select(f,'provider').value=v.p;select(f,'provider').dispatchEvent(new Event('change'));
   select(f,'place').value=v.l;select(f,'place').dispatchEvent(new Event('change'));
   const y=select(f,'year');if([...y.options].some(o=>o.value===v.y))y.value=v.y;
   return Promise.resolve(state.catalogPromise[side]).then(()=>{
    if(token!==swapSerial||select(f,'provider').value!==v.p||select(f,'place').value!==v.l)return false;
    if(![...y.options].some(o=>o.value===v.y))return false;
    y.value=v.y;return true;
   });
  };
  const res=await Promise.all([apply('A',right),apply('B',left)]);
  if(token!==swapSerial||res.some(v=>!v))return;
  state.A=oldB;state.B=oldA;
  if(state.A)setStatus('A','Datos oficiales intercambiados.');
  if(state.B)setStatus('B','Datos oficiales intercambiados.');
  refreshCharts();resultReset();updateButtons();
 });
 $('analyze').addEventListener('click',showComparison);
 $('readingMode').addEventListener('change',()=>{if(state.A&&state.B)showComparison();});
 $('export').addEventListener('click',()=>download('comparacion-estructura-social.txt',exportText(),'text/plain;charset=utf-8'));
 $('exportCSV').addEventListener('click',()=>download('piramides-A-y-B.csv','Piramide;Fuente;Territorio;Año;Edad;Hombres;Mujeres\n'+['A','B'].flatMap(side=>state[side].cohorts.map(row=>[side,state[side].meta.provider,state[side].meta.place,state[side].meta.year,row.label,row.m,row.f].join(';'))).join('\n')+'\n','text/csv;charset=utf-8'));
 $('print').addEventListener('click',()=>{showComparison();window.print();});
 const initialBRevision=state.revision.B;
 Promise.all([load('A'),state.catalogPromise.B.then(()=>{if(state.revision.B===initialBRevision&&select($('formB'),'year').value)return load('B');})]).then(()=>{if(state.A&&state.B)showComparison();});
 if('serviceWorker' in navigator && location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
init();
