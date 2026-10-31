const url='https://www.idescat.cat/serveis/consultes/es/censph_539_mun_2025_pc.csv';
try{
 const r=await fetch(url,{signal:AbortSignal.timeout(45000)});
 console.log('HTTP',r.status,'content-type',r.headers.get('content-type'),'CORS',r.headers.get('access-control-allow-origin'),'length',r.headers.get('content-length'));
 const s=await r.text();console.log('CHARACTERS',s.length,'FIRST LINES',s.split(/\r?\n/).slice(0,12).join('\n'));
 console.log('BARCELONA',s.split(/\r?\n/).filter(x=>/Barcelona|Hospitalet/i.test(x)).slice(0,8).join('\n'));
}catch(e){console.error(e.stack);process.exitCode=1;}
