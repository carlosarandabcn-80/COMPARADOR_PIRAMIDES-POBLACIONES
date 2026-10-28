const urls=[
'https://servicios.ine.es/wstempus/js/es/GRUPOS_TABLA/68534',
'https://servicios.ine.es/wstempus/js/es/SERIES_TABLA/68534?tip=M',
'https://servicios.ine.es/wstempus/js/es/DATOS_TABLA/68534?nult=1&tip=A'
];
for(const url of urls){
 console.log('\nPROBING',url);
 try{const r=await fetch(url,{signal:AbortSignal.timeout(40000)});console.log('STATUS',r.status,'CORS',r.headers.get('access-control-allow-origin'));if(!r.ok)continue;const txt=await r.text();console.log('BYTES',txt.length,'SNIPPET',txt.slice(0,4400));if(url.includes('SERIES_TABLA')){const arr=JSON.parse(txt);console.log('EXAMPLE',JSON.stringify(arr.slice(0,2)).slice(0,8000));}}
 catch(e){console.log('FAIL',String(e))}
}
