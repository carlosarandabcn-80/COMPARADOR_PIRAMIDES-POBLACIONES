import {ineURL,parseINE,indicators,fromEurostat,eurostatURL} from '../lab/comparison-core.mjs';
for(const year of [2001,2025]){
 const u=ineURL(year);console.log('INE CONSULTA',u);
 const r=await fetch(u,{signal:AbortSignal.timeout(35000)});
 if(!r.ok)throw new Error('INE '+year+' HTTP '+r.status);
 const d=parseINE(await r.json(),year);
 console.log('INE VALIDADO',year,indicators(d).total,'hombres',indicators(d).men,'mujeres',indicators(d).women,'85+',d.cohorts[17].m+d.cohorts[17].f);
 if(year===2025 && indicators(d).total!==49128297)throw new Error('La serie de 2025 no coincide con la cifra nacional del INE.');
}
const r=await fetch(eurostatURL('ES',2025),{signal:AbortSignal.timeout(35000)});
if(!r.ok)throw new Error('Eurostat HTTP '+r.status);
const d=fromEurostat(await r.json(),'ES',2025);
console.log('EUROSTAT VALIDADO',indicators(d).total,'2025',d.meta.updatedAt);
