import test from 'node:test';import assert from 'node:assert/strict';
import {BANDS,check,indicators,status,classify,describe,compare,eurostatURL,fromEurostat,parseINE,serializeCSV} from '../lab/comparison-core.mjs';
const make=(provider='Eurostat',year=2025)=>check({meta:{provider,kind:'oficial',place:'España',unit:'personas',year,referenceDate:year+'-01-01',sourceUrl:'https://example.org',updatedAt:'test',note:''},cohorts:BANDS.map((b,i)=>({...b,m:100-i,f:90-i}))});
test('morfología, cohortes y resultados de referencia',()=>{
 const d=make(),i=indicators(d);assert.equal(d.cohorts.length,18);
 assert.equal(i.total, BANDS.reduce((s,b,i)=>s+190-2*i,0));
 assert.equal(i.men,18*100-153);assert.equal(i.women,18*90-153);
 assert.equal(Math.round(i.pYouth+i.pActive+i.pOld),100);
 assert.ok(classify(d).type.length>5);assert.equal(describe(d).paragraphs.length,5);
});
test('comparación de puntos porcentuales y fuentes',()=>{
 const a=make('Eurostat',2025),b=make('INE',2025),r=compare(a,b);
 assert.equal(r.rows.length,6);assert.equal(r.rows[2].delta,0);
 assert.equal(status(a,b).ok,true);
});
test('rechazar errores de recuento y origen',()=>{
 let d=make();d.cohorts[0].m=-1;assert.throws(()=>check(d));
 d=make();d.meta.kind='sintetico';assert.throws(()=>check(d));
 d=make();d.cohorts[1].label='5-9';assert.throws(()=>check(d));
});
test('consulta Eurostat emite filtros y validación de respuesta',()=>{
 const url=new URL(eurostatURL('ES',2025));assert.equal(url.searchParams.get('geo'),'ES');
 assert.equal(url.searchParams.getAll('sex').length,2);
 assert.throws(()=>eurostatURL('ES',2030));
 const ages=['TOTAL','Y_LT1',...Array.from({length:99},(_,i)=>'Y'+(i+1)),'Y_OPEN','UNK'];
 const idx=(a)=>Object.fromEntries(a.map((v,i)=>[v,i]));
 const value={};let total=0;
 ages.forEach((a,i)=>{const base=i*2;if(a==='TOTAL')return;
  if(a==='UNK')return;value[base]=100;value[base+1]=101;total+=201;});
 value[0]=10100;value[1]=10201; // totales de 101 edades (0–99 y 100+)
 const sample={id:['age','sex','geo','time','unit','freq'],size:[ages.length,2,1,1,1,1],dimension:{
  age:{category:{index:idx(ages)}},sex:{category:{index:{M:0,F:1}}},geo:{category:{index:{ES:0}}},time:{category:{index:{'2025':0}}},unit:{category:{index:{NR:0}}},freq:{category:{index:{A:0}}}},value,updated:'2026-10-01'};
 assert.equal(fromEurostat(sample,'ES',2025).meta.provider,'Eurostat');
});
test('datos INE CSV conserva todas las edades',()=>{const d=make('INE');assert.equal(serializeCSV(d).split('\n').length,20);});
test('INE rechaza estructuras ausentes',()=>{assert.throws(()=>parseINE([],2025),/falta edad/);});
