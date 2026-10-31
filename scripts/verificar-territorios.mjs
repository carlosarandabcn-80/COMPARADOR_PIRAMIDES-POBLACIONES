import {ineTerritoryURL,parseINETerritory} from '../lab/comparison-core.mjs';
const cases=[['CT',2025],['BCN_P',2025],['BCN_M',2025],['HOSP_M',2025]];
let failures=0;
for(const [code,year] of cases){
 try{
  const url=ineTerritoryURL(code,year),res=await fetch(url,{signal:AbortSignal.timeout(90000),headers:{Accept:'application/json'}});
  if(!res.ok)throw new Error('HTTP '+res.status);
  const json=await res.json(),dataset=parseINETerritory(json,code,year);
  console.log('OK',code,year,'tabla',dataset.meta.table,'personas',dataset.total,'cohortes',dataset.cohorts.length,'series descargadas',json.length);
 }catch(error){failures++;console.error('ERROR',code,year,error.message);}
}
if(failures){console.error(failures+' de '+cases.length+' verificaciones territoriales fallidas');process.exitCode=1;}
else console.log('Todas las comprobaciones territoriales seleccionadas son válidas.');
