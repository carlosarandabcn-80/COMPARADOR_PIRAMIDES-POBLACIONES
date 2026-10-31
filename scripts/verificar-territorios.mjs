import {ineTerritoryURL,parseINETerritory} from '../lab/comparison-core.mjs';
let failures=0;
for(const code of ['CT','BCN_P']){
 try{
  const year=2026,url=ineTerritoryURL(code,year),res=await fetch(url,{signal:AbortSignal.timeout(90000)});
  if(!res.ok)throw new Error('HTTP '+res.status);
  const j=await res.json(),d=parseINETerritory(j,code,year);
  console.log('OK',code,'tabla',d.meta.table,'año',year,'cohortes',d.cohorts.length,'total',d.total);
 }catch(err){failures++;console.error('ERROR',code,err.message);}
}
if(failures)process.exitCode=1;
