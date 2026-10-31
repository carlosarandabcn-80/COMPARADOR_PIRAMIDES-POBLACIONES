import {ineTerritoryURL,parseINETerritory} from '../lab/comparison-core.mjs';
const cases=[['CT',2026],['BCN_P',2026],['BCN_M',2025],['HOSP_M',2025]];
let failures=0;
for(const [code,year] of cases){
 try{
  const url=ineTerritoryURL(code,year),res=await fetch(url,{signal:AbortSignal.timeout(90000),headers:{Accept:'application/json'}});
  if(!res.ok)throw new Error('HTTP '+res.status);
  const json=await res.json();
  console.log('DIAGNÓSTICO',code,'registros',Array.isArray(json)?json.length:'formato no array', 'respuesta no array:',Array.isArray(json)?'':JSON.stringify(json).slice(0,350));
  if(Array.isArray(json)){
   console.log('EJEMPLOS',json.slice(0,6).map(x=>({Nombre:x.Nombre,Data:x.Data?.slice(0,1)})));
   console.log('SERIES REFERIDAS',json.filter(x=>/catalu|barcelona|hospitalet/i.test(x.Nombre||'')).slice(0,6).map(x=>({Nombre:x.Nombre,Data:x.Data?.slice(0,2)})));
  }
  const dataset=parseINETerritory(json,code,year);
  console.log('OK',code,year,'tabla',dataset.meta.table,'personas',dataset.total,'cohortes',dataset.cohorts.length,'series descargadas',json.length);
 }catch(error){failures++;console.error('ERROR',code,year,error.message);}
}
if(failures){console.error(failures+' de '+cases.length+' verificaciones territoriales fallidas');process.exitCode=1;}
else console.log('Todas las comprobaciones territoriales seleccionadas son válidas.');
