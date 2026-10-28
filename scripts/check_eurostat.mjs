import {parseEurostat,eurostatURL,indicators} from '../lab/core.mjs';
const url=eurostatURL('ES',2025),controller=AbortSignal.timeout(30000);
try{
  const response=await fetch(url,{signal:controller,headers:{Accept:'application/json'}});
  console.log('HTTP:',response.status,'URL:',url);
  if(!response.ok)throw new Error('HTTP '+response.status);
  const payload=await response.json();
  console.log('Dimensions:',payload.id,'size:',payload.size);
  const keys=Object.keys(payload.dimension?.age?.category?.index||{});
  console.log('Age sample:',keys.slice(0,8),'Age tail:',keys.slice(-12));
  const d=parseEurostat(payload,'ES',2025),i=indicators(d);
  console.log('LIVE VERIFIED:',d.meta.name,'total=',i.total,'source_update=',d.meta.updatedAt);
}catch(error){console.error('LIVE CHECK FAILED:',error.message);process.exitCode=1;}
