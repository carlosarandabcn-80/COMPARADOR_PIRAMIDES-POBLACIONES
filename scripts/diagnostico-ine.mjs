for(const year of [2001,2025,2026]){
 const url='https://servicios.ine.es/wstempus/js/es/DATOS_TABLA/56934?date='+year+'0101:'+year+'0101&tip=A';
 console.log('PROBE',url);
 try{const r=await fetch(url,{signal:AbortSignal.timeout(35000)});console.log('HTTP',r.status,'CORS',r.headers.get('access-control-allow-origin'));if(!r.ok)continue;
  const text=await r.text();const arr=JSON.parse(text);console.log('RECEIVED',text.length,'rows',arr.length);
  console.log('SAMPLE',JSON.stringify(arr.slice(0,5),null,2).slice(0,5000));
  console.log('HEAD NAMES',arr.slice(0,15).map(x=>x.Nombre).join(' || ').slice(0,2700));
 }catch(e){console.log('FAIL',String(e))}
}