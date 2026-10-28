import test from 'node:test';
import assert from 'node:assert/strict';
import {AGE_BANDS,synthetic,validateDataset,indicators,comparable,trace,parseCSV,parseJSON,toCSV,toJSON,eurostatURL,parseEurostat,CASES,gradeCase} from '../lab/core.mjs';

test('los cuatro modelos tienen 18 cohortes válidas',()=>{
  for(const key of ['joven','envejecida','transicion','muesca']){
    const d=synthetic(key);assert.equal(d.meta.kind,'sintetico');
    assert.equal(d.cohorts.length,18);assert.ok(indicators(d).total>0);
  }
});
const fixture=()=>validateDataset({meta:{name:'Caso comprobable',kind:'aportado',unit:'personas'},cohorts:AGE_BANDS.map(b=>({...b,m:1,f:1}))});
test('indicadores con resultados conocidos y proporciones reproducibles',()=>{
  const i=indicators(fixture());
  assert.deepEqual([i.total,i.men,i.women,i.youth,i.working,i.old],[36,18,18,6,20,10]);
  assert.equal(i.youthDependency,30);assert.equal(i.oldDependency,50);
  assert.equal(i.totalDependency,80);assert.equal(i.ageingIndex,166.6667);
  assert.equal(i.youthPct,16.6667);assert.equal(i.oldPct,27.7778);
  assert.equal(i.maleToFemale,100);assert.equal(i.womenInOld,50);
});
test('cero en denominadores muestra nulo, no infinito',()=>{
  const d=fixture();for(const c of d.cohorts.slice(3,13)){c.m=0;c.f=0;}
  const i=indicators(d);assert.equal(i.totalDependency,null);assert.equal(i.oldDependency,null);
  const e=fixture();for(const c of e.cohorts.slice(0,3)){c.m=0;c.f=0;}
  assert.equal(indicators(e).ageingIndex,null);
});
test('rechazo de población negativa, decimal, NaN y edad incompatible',()=>{
  for(const bad of [-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1]){
    const d=fixture();d.cohorts[0].m=bad;assert.throws(()=>validateDataset(d));
  }
  const d=fixture();d.cohorts[2].label='grupo duplicado';assert.throws(()=>validateDataset(d));
});
test('solo permite comparar datos sintéticos entre sí',()=>{
  const a=synthetic('joven'),b=fixture();
  assert.equal(comparable(a,b).valid,false);
  assert.equal(comparable(a,synthetic('envejecida')).valid,true);
  assert.equal(trace(a,b).some(x=>x.id==='R04'),false);
});
test('importación CSV con encabezado y exportación coherente',()=>{
  const data=fixture();const csv=toCSV(data);
  const copy=parseCSV(csv);assert.equal(indicators(copy).total,36);
  assert.equal(copy.meta.kind,'aportado');
  assert.throws(()=>parseCSV('edad,hombres,mujeres\n0-4,-2,2'));
  assert.throws(()=>parseCSV('edad,hombres,mujeres\n0-4,2,2'));
});
test('un JSON importado no conserva etiqueta de fuente oficial',()=>{
  const d=fixture();d.meta.kind='oficial';
  const copy=parseJSON(toJSON(d));assert.equal(copy.meta.kind,'aportado');
});
test('la URL oficial es estable y verifica el año',()=>{
  const url=eurostatURL('ES',2025);assert.match(url,/demo_pjan/);
  assert.equal(new URL(url).searchParams.get('geo'),'ES');
  assert.throws(()=>eurostatURL('ES',2030));
  assert.throws(()=>eurostatURL('XX-peligro',2025));
});
test('JSON-stat se convierte a cohortes solo con todas las edades y ambos sexos',()=>{
  const ages=['Y_LT1',...Array.from({length:99},(_,i)=>'Y'+(i+1)),'Y_OPEN'];
  const index=arr=>Object.fromEntries(arr.map((v,i)=>[v,i]));
  const json={id:['age','sex','geo','time','unit','freq'],size:[101,2,1,1,1,1],
    dimension:{age:{category:{index:index(ages)}},sex:{category:{index:{M:0,F:1}}},
    geo:{category:{index:{ES:0}}},time:{category:{index:{'2025':0}}},unit:{category:{index:{NR:0}}},freq:{category:{index:{A:0}}}},
    updated:'2026-09-25',value:Object.fromEntries(Array.from({length:202},(_,i)=>[i,5]))};
  const d=parseEurostat(json,'ES',2025);assert.equal(d.meta.kind,'oficial');
  assert.deepEqual([d.cohorts[0].m,d.cohorts[17].f,indicators(d).total],[25,80,1010]);
  delete json.value[0];assert.throws(()=>parseEurostat(json,'ES',2025),/no se imputan/);
});
test('los seis casos disponen de corrección y razonamiento',()=>{
  assert.equal(CASES.length,6);
  for(const c of CASES){assert.ok(c.why.length>40);assert.ok(gradeCase(c.id,c.answer).correct);}
});
