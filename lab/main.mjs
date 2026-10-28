import {AGE_BANDS,MODES,synthetic,validateDataset,indicators,comparable,trace,parseCSV,parseJSON,toCSV,toJSON,eurostatURL,parseEurostat,CASES,gradeCase} from './core.mjs';
const $=id=>document.getElementById(id),fmt=new Intl.NumberFormat('es-ES',{maximumFractionDigits:2}),num=x=>x===null?'No calculable':fmt.format(x);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const say=(id,message)=>{$(id).textContent=message;};
const datasets=Object.fromEntries(Object.keys(MODES).map(key=>[key,synthetic(key)]));
const state={primary:'transicion',secondary:'envejecida',caseId:'C1'};
const fields=['need','hypotheses','rights','action','process','outcomes'];
const defs=[['total','Población total','Suma de las celdas'],['youthPct','Menores de 15 (%)','0–14 / total × 100'],['oldPct','65 años o más (%)','65+ / total × 100'],['youthDependency','Dependencia juvenil','0–14 / 15–64 × 100'],['oldDependency','Dependencia de mayores','65+ / 15–64 × 100'],['totalDependency','Dependencia total','(0–14 + 65+) / 15–64 × 100'],['ageingIndex','Índice de envejecimiento','65+ / 0–14 × 100'],['maleToFemale','Hombres por 100 mujeres','Hombres / mujeres × 100'],['womenInOld','Mujeres entre 65+ (%)','Mujeres 65+ / total 65+ × 100']];
function readLocal(){try{const p=JSON.parse(localStorage.getItem('lab-poblacion-v1')||'{}');for(const k of ['primary','secondary'])if(datasets[p[k]])state[k]=p[k];for(const k of fields)if(typeof p[k]==='string')$(k).value=p[k].slice(0,5000);}catch{/* almacenamiento no disponible */}}
function saveLocal(){try{localStorage.setItem('lab-poblacion-v1',JSON.stringify({primary:state.primary,secondary:state.secondary,...Object.fromEntries(fields.map(k=>[k,$(k).value.slice(0,5000)]))}));return true;}catch{return false;}}
function updateSelects(){for(const [id,key] of [['primaryDataset','primary'],['secondaryDataset','secondary']]){$(id).replaceChildren();for(const [k,v] of Object.entries(datasets)){const o=document.createElement('option');o.value=k;o.textContent=v.meta.name;$(id).append(o);}$(id).value=state[key];}}
function sourceNote(d){const m=d.meta;return [(m.kind==='oficial'?'DATOS OFICIALES CONSULTADOS':m.kind==='sintetico'?'MODELO SINTÉTICO (NO REAL)':'DATOS APORTADOS (SIN VERIFICAR)'),m.name,'Fuente: '+m.source,'Referencia: '+m.referenceDate,'Actualización: '+m.updatedAt,'Unidad: '+m.unit,'Límite: '+m.limitations].join(' · ');}
function chart(d,target,scale,focus){
  const total=indicators(d).total,values=d.cohorts.map(c=>scale==='percent'?{m:c.m*100/total,f:c.f*100/total}:{m:c.m,f:c.f});
  const max=Math.max(.1,...values.flatMap(v=>[v.m,v.f])),mid=310,span=230;
  const rects=values.map((v,i)=>{const y=34+(17-i)*24,active=focus==='all'||(focus==='youth'&&i<3)||(focus==='working'&&i>=3&&i<13)||(focus==='old'&&i>=13);
    const m=span*v.m/max,f=span*v.f/max,cls=active?'':' dimmed',lab=esc(d.cohorts[i].label);
    return '<rect class="bar-m'+cls+'" x="'+(mid-m)+'" y="'+y+'" width="'+m+'" height="18"><title>'+lab+' hombres: '+num(d.cohorts[i].m)+'</title></rect>'+
    '<rect class="bar-f'+cls+'" x="'+mid+'" y="'+y+'" width="'+f+'" height="18"><title>'+lab+' mujeres: '+num(d.cohorts[i].f)+'</title></rect>'+
    '<text class="svg-band" x="'+mid+'" y="'+(y+13)+'" text-anchor="middle" style="paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round">'+lab+'</text>';
  }).join('');
  const grid=[0,.25,.5,.75,1].map(p=>[mid-span*p,mid+span*p].map(x=>'<line class="svg-axis" x1="'+x+'" y1="24" x2="'+x+'" y2="462" opacity=".18"/><text class="svg-tick" x="'+x+'" y="482" text-anchor="middle">'+num(max*p)+'</text>').join('')).join('');
  $(target).innerHTML='<svg class="pyramid-svg" role="img" aria-label="'+esc('Pirámide de '+d.meta.name+'. Tabla accesible disponible a continuación.')+'" viewBox="0 0 620 520"><text class="svg-label" x="176" y="15" text-anchor="middle">Hombres</text><text class="svg-label" x="447" y="15" text-anchor="middle">Mujeres</text>'+grid+rects+'<text class="svg-tick" x="310" y="511" text-anchor="middle">'+(scale==='percent'?'Porcentaje del total (%)':'Efectivos')+'</text></svg>';
}
function table(d,target){$(target).innerHTML='<table class="data-table"><caption>'+esc(d.meta.name)+' · '+esc(d.meta.unit)+'</caption><thead><tr><th scope="col">Edad</th><th scope="col">Hombres</th><th scope="col">Mujeres</th><th scope="col">Total</th></tr></thead><tbody>'+d.cohorts.map(c=>'<tr><th scope="row">'+esc(c.label)+'</th><td>'+num(c.m)+'</td><td>'+num(c.f)+'</td><td>'+num(c.m+c.f)+'</td></tr>').join('')+'</tbody></table>';}
function metrics(d){const i=indicators(d);$('metrics').innerHTML=defs.map(([key,name,formula])=>'<div class="metric"><span class="value">'+num(i[key])+'</span><span class="term">'+esc(name)+'</span><span class="caption">'+esc(formula)+'</span></div>').join('');}
function compare(a,b){if(!comparable(a,b).valid){say('comparison','Comparación numérica no disponible: '+comparable(a,b).warning);return;}const x=indicators(a),y=indicators(b);$('comparison').innerHTML=[['oldPct','Porcentaje de 65+','puntos porcentuales'],['youthPct','Porcentaje menores 15','puntos porcentuales'],['ageingIndex','Índice de envejecimiento','puntos de índice'],['totalDependency','Dependencia total','personas por cada 100']].map(([key,label,unit])=>{const diff=x[key]===null||y[key]===null?null:x[key]-y[key];return '<div class="compare-row"><b>'+esc(label)+'</b>'+num(x[key])+' / '+num(y[key])+'<br><strong>Diferencia: '+(diff>0?'+':'')+num(diff)+'</strong> <small>'+unit+'</small></div>';}).join('');}
function reasoning(a,b){$('reasoning').innerHTML=trace(a,b).map(r=>'<article class="card reason-card"><h3>Regla '+esc(r.id)+'</h3><dl class="reason-grid">'+[['Observación',r.observation],['Interpretación',r.reading],['Hipótesis no verificada',r.hypothesis],['Información pendiente',r.verify],['Intervención condicionada',r.conditioned],['Limitación',r.limit]].map(([k,v])=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd></div>').join('')+'</dl></article>').join('');}
function report(){
  const a=datasets[state.primary],b=datasets[state.secondary],x=indicators(a),y=indicators(b);
  return [
    'LABORATORIO DE DEMOGRAFÍA APLICADA A LA EDUCACIÓN SOCIAL','Informe exploratorio generado '+new Date().toLocaleDateString('es-ES'),
    'NO CONSTITUYE UN DIAGNÓSTICO SOCIAL CONFIRMADO.','','1. OBJETO Y FUENTES',sourceNote(a),sourceNote(b),
    'Comparabilidad: '+comparable(a,b).warning,
    '\n2. MÉTODO', 'Grupos 0–4, …, 80–84, 85+. Razones de dependencia demográfica = grupos de 0–14 y/o 65+ dividido por 15–64, multiplicado por 100. Índice de envejecimiento = 65+ / 0–14 × 100. Denominador cero = no calculable.',
    '\n3. DATOS PRINCIPALES','Edad\tHombres\tMujeres\tTotal',
    ...a.cohorts.map(c=>[c.label,c.m,c.f,c.m+c.f].join('\t')),
    '\n4. INDICADORES PRINCIPALES / CONTRASTE',
    ...defs.map(([key,name,formula])=>name+': '+num(x[key])+' / '+num(y[key])+' | '+formula),
    '\n5. RAZONAMIENTO TRAZABLE',
    ...trace(a,b).flatMap(r=>[r.id+' · Observación: '+r.observation,'Interpretación: '+r.reading,'Hipótesis no probada: '+r.hypothesis,'Datos adicionales: '+r.verify,'Actuación condicional: '+r.conditioned,'Sesgos y límites: '+r.limit,'']),
    '\n6. FICHA DE INTERVENCIÓN SOCIOEDUCATIVA',
    ...fields.map((k,i)=>['Necesidad investigable','Hipótesis alternativas','Derechos y participación','Actuación condicionada','Indicadores de proceso','Resultados y evaluación'][i]+': '+($(k).value.trim()||'[Sin completar]')),
    '\n7. CONCLUSIONES Y LÍMITES','Las variables demográficas no prueban pobreza, exclusión, dependencia funcional ni necesidades individuales. Para evaluar impacto causal son necesarios diseños específicos; la variación pre/post sin control no basta.',
    '\n8. ENLACES DE REFERENCIA','Eurostat demo_pjan: https://ec.europa.eu/eurostat/databrowser/view/demo_pjan/default/table?lang=en','INE: https://www.ine.es/datosabiertos/','Idescat: https://www.idescat.cat/dades/obertes/','WCAG 2.2: https://www.w3.org/TR/WCAG22/','Revisar las referencias en APA 7 antes de una entrega académica.'
  ].join('\n');
}
function render(){updateSelects();const a=datasets[state.primary],b=datasets[state.secondary],focus=$('focus').value;
  say('metaMain',sourceNote(a));chart(a,'chartMain',$('scale').value,focus);table(a,'tableMain');metrics(a);
  say('compareStatus',comparable(a,b).warning+' · '+sourceNote(b));chart(b,'chartSecondary','percent',focus);table(b,'tableSecondary');
  compare(a,b);reasoning(a,b);say('reportPreview',report());
}
function download(filename,content,mime){const url=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function renderCase(){
  const c=CASES.find(c=>c.id===state.caseId),el=$('casePanel');el.replaceChildren();
  const h=document.createElement('h3');h.textContent=c.name;const p=document.createElement('p');p.className='case-question';p.textContent=c.question;
  const activity=document.createElement('p');activity.textContent='Actividad: '+c.activity;const feedback=document.createElement('div');feedback.setAttribute('role','status');
  const options=document.createElement('div');options.className='case-options';
  for(const [val,label] of [[true,'Sí, está demostrado'],[false,'No, faltan pruebas']]){
    const btn=document.createElement('button');btn.type='button';btn.className='button secondary';btn.textContent=label;btn.setAttribute('aria-pressed','false');
    btn.addEventListener('click',()=>{const result=gradeCase(c.id,val);feedback.className='case-feedback';feedback.textContent=(result.correct?'Correcto. ':'Incorrecto. ')+result.explanation;options.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));});options.append(btn);
  }el.append(h,p,activity,options,feedback);
}
function init(){
  for(let year=2025;year>=2000;year--){const o=document.createElement('option');o.value=year;o.textContent=year;$('year').append(o);}
  for(const c of CASES){const o=document.createElement('option');o.value=c.id;o.textContent=c.id+' · '+c.name;$('caseSelector').append(o);}
  readLocal();
  for(const [id,key] of [['primaryDataset','primary'],['secondaryDataset','secondary']])$(id).addEventListener('change',e=>{state[key]=e.target.value;saveLocal();render();});
  for(const id of ['scale','focus'])$(id).addEventListener('change',render);
  $('swap').addEventListener('click',()=>{[state.primary,state.secondary]=[state.secondary,state.primary];saveLocal();render();});
  $('caseSelector').addEventListener('change',e=>{state.caseId=e.target.value;renderCase();});
  for(const k of fields)$(k).addEventListener('input',()=>say('reportPreview',report()));
  $('saveProposal').addEventListener('click',()=>say('saveStatus',saveLocal()?'Guardado localmente.':'Almacenamiento bloqueado por el navegador.'));
  $('clearProposal').addEventListener('click',()=>{for(const k of fields)$(k).value='';saveLocal();say('reportPreview',report());say('saveStatus','Ficha borrada.');});
  $('downloadCSV').addEventListener('click',()=>download('pirámide.csv',toCSV(datasets[state.primary]),'text/csv;charset=utf-8'));
  $('downloadJSON').addEventListener('click',()=>download('pirámide.json',toJSON(datasets[state.primary]),'application/json;charset=utf-8'));
  $('downloadReport').addEventListener('click',()=>download('informe-demografia.txt',report(),'text/plain;charset=utf-8'));
  $('printReport').addEventListener('click',()=>window.print());
  $('upload').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>1000000)throw Error('Máximo 1 MB.');const raw=await file.text(),d=/\.json$/i.test(file.name)?parseJSON(raw):parseCSV(raw,file.name);d.meta.kind='aportado';d.meta.source='Archivo aportado: '+file.name.slice(0,80);datasets.importacion=d;state.primary='importacion';say('uploadStatus','Importación local correcta; procedencia no verificada.');render();}catch(error){say('uploadStatus','Error: '+error.message);}});
  $('loadEurostat').addEventListener('click',async()=>{const geo=$('country').value,year=Number($('year').value),btn=$('loadEurostat');btn.disabled=true;say('apiStatus','Consultando Eurostat. No se imputarán valores ausentes.');const ctrl=new AbortController(),t=setTimeout(()=>ctrl.abort(),18000);
    try{const response=await fetch(eurostatURL(geo,year),{signal:ctrl.signal,cache:'no-store'});if(!response.ok)throw Error('HTTP '+response.status);const d=parseEurostat(await response.json(),geo,year);const key='oficial-'+geo+'-'+year;datasets[key]=d;state.primary=key;say('apiStatus','Datos recibidos: '+d.meta.name+'. Comprueba banderas y notas de la fuente.');render();}catch(error){say('apiStatus','Consulta no verificada: '+error.message+'. No se fabrican cifras de sustitución.');}finally{clearTimeout(t);btn.disabled=false;}
  });
  render();renderCase();
}
init();
