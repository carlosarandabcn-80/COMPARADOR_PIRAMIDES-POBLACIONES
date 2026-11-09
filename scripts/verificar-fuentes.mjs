import assert from 'node:assert/strict';
import {ineURL,parseINE,indicators,fromEurostat,eurostatURL} from '../lab/comparison-core.mjs';
const historical85={1974:[64690,134645],1975:[65564,135608]};
for(const year of [1974,1975,2001,2025,2026]){
 const u=ineURL(year);console.log('INE CONSULTA',u);
 const r=await fetch(u,{signal:AbortSignal.timeout(35000)});
 if(!r.ok)throw new Error('INE '+year+' HTTP '+r.status);
 const d=parseINE(await r.json(),year);
 console.log('INE VALIDADO',year,indicators(d).total,'hombres',indicators(d).men,'mujeres',indicators(d).women,'85+',d.cohorts[17].m+d.cohorts[17].f);
 if(historical85[year])assert.deepEqual([d.cohorts[17].m,d.cohorts[17].f],historical85[year]);
 if(year===2026)assert.equal(d.meta.table,'59583');
 if(year===2025 && indicators(d).total!==49128297)throw new Error('La serie de 2025 no coincide con la cifra nacional del INE.');
}
for(const [geo,year,expected] of [['ES',2025,49128297],['DE',2009,82002356],['ES',2001,40665545]]){
 const url=eurostatURL(geo,year),r=await fetch(url,{signal:AbortSignal.timeout(35000)});
 if(!r.ok)throw new Error('Eurostat '+geo+' '+year+' HTTP '+r.status);
 const d=fromEurostat(await r.json(),geo,year);
 console.log('EUROSTAT VALIDADO',geo,year,indicators(d).total,d.meta.table,d.meta.updatedAt);
 if(indicators(d).total!==expected)throw new Error('Eurostat '+geo+' '+year+': total no coincide con la cifra oficial de referencia '+expected+'.');
}

