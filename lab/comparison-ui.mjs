import {BANDS,COUNTRIES,SOURCES,check,indicators,status,describe,compare,eurostatURL,fromEurostat,ineURL,parseINE,serializeCSV} from './comparison-core.mjs';
const $=id=>document.getElementById(id),format=new Intl.NumberFormat('es-ES',{maximumFractionDigits:2}),n=x=>x===null?'No calculable':format.format(x);
const esc=s=>String(s).replace(/[&<>"']/g,v=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[v]));
const state={A:null,B:null,loading:{A:false,B:false}};
const labels=[['pYouth','0–14 años','%'],['pActive','15–64 años','%'],['pOld','65+ años','%'],['ageing','Índice envejecimiento','65+/0–14 × 100'],['dependency','Dependencia demográfica','(0–14 + 65+) / 15–64 × 100'],['total','Población total','personas']];
const select=(form,key)=>form.elements.namedItem(key);
function setupForm(side,defYear){
 const f=$('form'+side),provider=select(f,'provider'),place=select(f,'place'),year=select(f,'year');
 const refresh=()=>{const euro=provider.value==='eurostat';place.replaceChildren();for(const [code,name] of Object.entries(euro?COUNTRIES:{ES:'España'})){const opt=new Option(name,code);place.add(opt);}
 place.value='ES';year.replaceChildren();for(let y=2026;y>=(euro?1960:1971);y--)year.add(new Option(String(y),String(y)));
 year.value=String(euro?defYear:2025);clear(side);};
 provider.addEventListener('change',refresh);
 for(const s of [place,year])s.addEventListener('change',()=>clear(side));
 f.addEventListener('submit',e=>{e.preventDefault();load(side);});
 refresh();
}
function clear(side){state[side]=null;$('status'+side).textContent='Selecciona el periodo y carga datos oficiales.';$('status'+side).className='status';$('chart'+side).innerHTML='<div class="placeholder">Sin datos cargados para esta selección.</div>';$('meta'+side).replaceChildren();$('stats'+side).replaceChildren();$('table'+side).replaceChildren();$('desc'+side).replaceChildren();resultReset();updateButtons();}
function resultReset(){$('results').innerHTML='<h3>Resultado comparativo</h3><p>Selecciona dos fuentes y periodos y pulsa «Comparar estructuras A y B».</p>';}
function updateButtons(){const ready=Boolean(state.A&&state.B&&status(state.A,state.B).ok);$('analyze').disabled=!ready;$('export').disabled=!ready;$('print').disabled=!ready;$('exportCSV').disabled=!ready;}
function setStatus(side,message,isError=false){const el=$('status'+side);el.textContent=message;el.className='status '+(isError?'error':'good');}
async function getJSON(url,ms=25000){
 const control=new AbortController(),t=setTimeout(()=>control.abort(),ms);
 try{
  const response=await fetch(url,{signal:control.signal,cache:'no-store'});
  if(!response.ok)throw new Error('La fuente devolvió HTTP '+response.status);
  const length=Number(response.headers.get('content-length')||0);
  if(length>80000000)throw new Error('Respuesta demasiado grande. Escoge otra selección.');
  return await response.json();
 }finally{clearTimeout(t);}
}
async function load(side){
 if(state.loading[side])return;
 const f=$('form'+side),provider=select(f,'provider').value,place=select(f,'place').value,year=Number(select(f,'year').value);
 clear(side);state.loading[side]=true;
 const button=f.querySelector('button[type=submit]');button.disabled=true;
 setStatus(side,'Consultando '+(provider==='ine'?'INE':'Eurostat')+' · '+year+'. Obteniendo únicamente datos oficiales…');
 try{
  let dataset;
  if(provider==='eurostat')dataset=fromEurostat(await getJSON(eurostatURL(place,year),35000),place,year);
  else dataset=parseINE(await getJSON(ineURL(year),90000),year);
  state[side]=dataset;setStatus(side,'Datos oficiales cargados y validados. '+dataset.meta.provider+' · '+dataset.meta.place+' · '+year+'.');
  refreshCharts();resultReset();updateButtons();
 }catch(error){setStatus(side,'No se han podido obtener datos válidos: '+error.message+'. Comprueba la fuente y vuelve a intentarlo. Nunca se sustituyen los datos por modelos ficticios.',true);}
 finally{state.loading[side]=false;button.disabled=false;}
}
function maxShared(scale){
 const arr=[state.A,state.B].filter(Boolean),values=arr.flatMap(d=>d.cohorts.flatMap(b=>scale==='percent'?[b.m/d.total*100,b.f/d.total*100]:[b.m,b.f]));
 return Math.max(.01,...values);
}
function chart(d,side,scale,focus,max){
 const {total}=d,mid=290,span=211,top=30,row=23.4;
 const active=i=>focus==='all'||(focus==='young'&&i<3)||(focus==='adult'&&i>=3&&i<13)||(focus==='old'&&i>=13);
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
 const p=document.createElement('p');p.textContent='Fuente: '+m.provider+' · '+m.place+' · '+m.year+' · referencia '+m.referenceDate+' · unidad: personas · actualización: '+m.updatedAt;
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
function showComparison(){
 if(!state.A||!state.B)return;const r=compare(state.A,state.B);
 const table='<div class="scroll"><table class="comparison-table"><caption>Comparación A menos B</caption><thead><tr><th scope="col">Indicador</th><th scope="col">A</th><th scope="col">B</th><th scope="col">Diferencia</th></tr></thead><tbody>'+
 r.rows.map(row=>'<tr><th scope="row">'+esc(row.label)+'</th><td>'+n(row.a)+'</td><td>'+n(row.b)+'</td><td>'+(row.delta>0?'+':'')+n(row.delta)+' <small>'+esc(row.unit)+'</small></td></tr>').join('')+'</tbody></table></div>';
 $('results').innerHTML='<h3>Comparación de estructuras poblacionales</h3>'+table+'<div class="result-text"><h4>Descripción comparada</h4><p>'+esc(r.description)+'</p></div><div class="subtle">'+r.notes.map(x=>'<p>'+esc(x)+'</p>').join('')+'</div>';
}
function exportText(){
 if(!state.A||!state.B)return '';
 const a=state.A,b=state.B,r=compare(a,b);
 return ['ESTRUCTURA SOCIAL · COMPARACIÓN DE PIRÁMIDES',new Date().toLocaleDateString('es-ES'),
  '\nPIRÁMIDE A: '+a.meta.provider+' · '+a.meta.place+' · '+a.meta.year,'Fuente: '+a.meta.sourceUrl,'Fecha: '+a.meta.referenceDate,
  ...describe(a).paragraphs,'\nPIRÁMIDE B: '+b.meta.provider+' · '+b.meta.place+' · '+b.meta.year,'Fuente: '+b.meta.sourceUrl,
  ...describe(b).paragraphs,'\nCOMPARACIÓN DE INDICADORES (A menos B)',
  ...r.rows.map(x=>x.label+' | A: '+n(x.a)+' | B: '+n(x.b)+' | diferencia: '+n(x.delta)+' '+x.unit),
  '\nDESCRIPCIÓN COMPARADA',r.description,'\nNOTAS Y LIMITACIONES',...r.notes,
  '\nFuente INE: '+SOURCES.ine.url,'Fuente Eurostat: '+SOURCES.eurostat.url,
  'NOTA: material de estudio independiente, basado en lectura demográfica del proyecto Estructura Social (UNIR).'].join('\n');
}
function download(name,content,mime){
 const url=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),800);
}
function types(){
 const weights={expansiva:[.98,.93,.88,.83,.78,.69,.61,.52,.43,.35,.28,.22,.16,.12,.09,.06,.04,.02],
 estacionaria:[.76,.78,.79,.80,.78,.77,.76,.77,.77,.76,.75,.72,.68,.57,.44,.32,.21,.13],
 regresiva:[.33,.38,.45,.52,.61,.70,.81,.93,1,.99,.91,.83,.71,.63,.57,.44,.36,.30]};
 for(const element of document.querySelectorAll('.type-figure')){
 const vals=weights[element.dataset.model],rects=vals.map((value,i)=>{const width=value*100,y=7+(17-i)*7.7;return '<rect x="'+(130-width)+'" y="'+y+'" width="'+width+'" height="6" fill="#61b2d9"/><rect x="130" y="'+y+'" width="'+width+'" height="6" fill="#e28aa7"/>';}).join('');
 element.innerHTML='<svg viewBox="0 0 260 155" role="presentation" focusable="false"><line x1="130" x2="130" y1="0" y2="155" stroke="#d6ecf1" opacity=".6"/>'+rects+'</svg>';
 }}
function restoreForm(side){
 const f=$('form'+side),provider=select(f,'provider'),country=select(f,'place'),year=select(f,'year');
 const source=provider.value,geography=country.value,date=year.value;
 const other=side==='A'?'B':'A',g=$('form'+other);
 select(g,'provider').value=source;select(g,'provider').dispatchEvent(new Event('change'));
 select(g,'place').value=geography;select(g,'year').value=date;
}
function init(){
 types();setupForm('A',2001);setupForm('B',2025);
 $('view').addEventListener('change',refreshCharts);
 $('focus').addEventListener('change',refreshCharts);
 $('swap').addEventListener('click',()=>{
  const formA=$('formA'),formB=$('formB');
  const originalA=state.A,originalB=state.B;
  const left={p:select(formA,'provider').value,l:select(formA,'place').value,y:select(formA,'year').value};
  const right={p:select(formB,'provider').value,l:select(formB,'place').value,y:select(formB,'year').value};
  const set=(f,v)=>{select(f,'provider').value=v.p;select(f,'provider').dispatchEvent(new Event('change'));select(f,'place').value=v.l;select(f,'year').value=v.y;};
  set(formA,right);set(formB,left);
  [state.A,state.B]=[originalB,originalA];
  if(state.A)setStatus('A','Datos oficiales intercambiados.');if(state.B)setStatus('B','Datos oficiales intercambiados.');
  refreshCharts();resultReset();updateButtons();
 });
 $('analyze').addEventListener('click',showComparison);
 $('export').addEventListener('click',()=>download('comparacion-estructura-social.txt',exportText(),'text/plain;charset=utf-8'));
 $('exportCSV').addEventListener('click',()=>download('piramides-A-y-B.csv','Piramide;Fuente;Territorio;Año;Edad;Hombres;Mujeres\n'+['A','B'].flatMap(side=>state[side].cohorts.map(row=>[side,state[side].meta.provider,state[side].meta.place,state[side].meta.year,row.label,row.m,row.f].join(';'))).join('\n')+'\n','text/csv;charset=utf-8'));
 $('print').addEventListener('click',()=>{showComparison();window.print();});
}
init();
