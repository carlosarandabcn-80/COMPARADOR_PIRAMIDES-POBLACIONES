import {COUNTRIES,eurostatURL,fromEurostat,indicators} from '../lab/comparison-core.mjs';
const codes=Object.keys(COUNTRIES);const years=[1960,1971,1990,2001,2009,2020,2025];const statuses=[];
async function testCountry(code){
 const url=new URL(eurostatURL(code,2025));url.searchParams.delete('time');
 try{
  const r=await fetch(url,{signal:AbortSignal.timeout(25000)});
  if(!r.ok){console.log('COUNTRY',code,'HTTP',r.status);return;}
  const json=await r.json(),valid=[];
  for(const year of years){
   try{const data=fromEurostat(json,code,year);valid.push(year);console.log('OK',code,year,indicators(data).total);}
   catch(e){console.log('UNAVAILABLE',code,year,String(e.message).slice(0,120));}
  }
  statuses.push({code,valid});
 }catch(e){console.log('CONNECTION_ERROR',code,String(e).slice(0,100));}
}
for(let i=0;i<codes.length;i+=3)await Promise.all(codes.slice(i,i+3).map(testCountry));
console.log('COVERAGE',JSON.stringify(statuses));
if(!statuses.some(x=>x.code==='DE'&&x.valid.includes(2009)))throw Error('Alemania 2009 no se ha resuelto.');
