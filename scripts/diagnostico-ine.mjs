const url='https://servicios.ine.es/wstempus/js/es/DATOS_TABLA/68534?nult=1&tip=AM';
const ctrl=AbortSignal.timeout(25000);
try{
 const r=await fetch(url,{signal:ctrl});
 console.log('INE status',r.status,'CORS',r.headers.get('access-control-allow-origin'),'type',r.headers.get('content-type'),'length',r.headers.get('content-length'));
 if(!r.ok)throw Error('HTTP '+r.status);
 const a=await r.json();console.log('top length',a.length,'shape',JSON.stringify(a.slice(0,4),null,2).slice(0,9000));
 console.log('NAME SAMPLE',JSON.stringify(a.filter(x=>/Hombres|Mujeres/.test(x.Nombre||'')).slice(0,4)).slice(0,5000));
}catch(e){console.log('INE ERROR',String(e));process.exitCode=1}
