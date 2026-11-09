import {INE_TERRITORIES,ineTerritoryURL,parseINETerritory} from '../lab/comparison-core.mjs';
const year=2026,queries=new Map();
let failures=0;
for(const code of Object.keys(INE_TERRITORIES).filter(code=>code!=='ES')){
 try{
  const url=ineTerritoryURL(code,year);
  if(!queries.has(url))queries.set(url,fetch(url,{signal:AbortSignal.timeout(90000)}).then(res=>{
   if(!res.ok)throw new Error('HTTP '+res.status);
   return res.json();
  }));
  const d=parseINETerritory(await queries.get(url),code,year);
  console.log('OK',code,'tabla',d.meta.table,'año',year,'cohortes',d.cohorts.length,'total',d.total);
 }catch(err){failures++;console.error('ERROR',code,err.message);}
}
if(failures)process.exitCode=1;
