import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {AGES,indicators,comparison,scenario} from '../src/core.js';
const data=JSON.parse(fs.readFileSync(new URL('../data/datasets.json',import.meta.url)));
const raw=JSON.parse(fs.readFileSync(new URL('../data/raw/eurostat-demo_pjan.json',import.meta.url)));
function cell(labels){let index=0;for(let i=0;i<raw.id.length;i++)index=index*raw.size[i]+raw.dimension[raw.id[i]].category.index[labels[raw.id[i]]];const value=raw.value[String(index)];assert.equal(typeof value,'number');return value;}
for(const d of data.filter(x=>x.kind==='observed'))test(`Revisión independiente de las 36 celdas oficiales ${d.id}`,()=>{
 for(let group=0;group<18;group++)for(const [sex,key]of [['M','male'],['F','female']]){
  let sum=0;for(let age=group*5;age<=(group===17?99:group*5+4);age++)sum+=cell({freq:'A',unit:'NR',age:age===0?'Y_LT1':'Y'+age,sex,geo:d.territoryCode,time:String(d.year)});
  if(group===17)sum+=cell({freq:'A',unit:'NR',age:'Y_OPEN',sex,geo:d.territoryCode,time:String(d.year)});
  assert.equal(d.rows[group][key],sum,`${d.id}, ${AGES[group]}, ${sex}`);
 }
});
let seed=20261027;
const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const samples=Array.from({length:100},(_,i)=>{const d=structuredClone(data[0]);d.id='review-'+i;d.rows=AGES.map(age=>({age,male:Math.floor(rand()*10000),female:Math.floor(rand()*10000)}));d.total=d.rows.reduce((s,r)=>s+r.male+r.female,0);return d;});
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} frente a ${b}`);
test('Cien distribuciones: indicadores contra cálculo por edades independiente',()=>{for(const d of samples){let y=0,a=0,o=0;for(let i=0;i<18;i++){const n=d.rows[i].male+d.rows[i].female;const lower=i*5;if(lower<15)y+=n;else if(lower<65)a+=n;else o+=n;}const n=indicators(d);near(n.depYouth,100*y/a);near(n.depOld,100*o/a);near(n.depTotal,100*(y+o)/a);near(n.aging,100*o/y);near(n.shareYoung,100*y/(y+a+o));near(n.shareOld,100*o/(y+a+o));}});
test('Cien distribuciones: escalar recuentos conserva los ocho indicadores relativos',()=>{for(const d of samples){const scaled=structuredClone(d);scaled.rows.forEach(r=>{r.male*=7;r.female*=7;});scaled.total*=7;const a=indicators(d),b=indicators(scaled);for(const k of ['depYouth','depOld','depTotal','aging','shareYoung','shareOld','sexRatio','womenOld'])near(a[k],b[k]);}});
test('Cien distribuciones: intercambiar categorías conserva edades e invierte razones',()=>{for(const d of samples){const swapped=structuredClone(d);swapped.rows.forEach(r=>[r.male,r.female]=[r.female,r.male]);const a=indicators(d),b=indicators(swapped);near(a.shareOld,b.shareOld);near(a.depTotal,b.depTotal);near(a.sexRatio*b.sexRatio,10000);near(a.womenOld*b.womenOld,10000);}});
test('Comparaciones: antisimetría de diferencias absolutas en cien pares',()=>{for(let i=0;i<100;i++){const a=samples[i],b=samples[(i+1)%100],ab=comparison(a,b),ba=comparison(b,a);for(const k of Object.keys(ab.differences))near(ab.differences[k].absolute,-ba.differences[k].absolute);}});
test('Escenario: conservación exacta con supervivencia 1 y límite de redondeo con q fraccional',()=>{for(const d of samples){const a=scenario(d,{births:101,survival:1,migration:21});assert.equal(a.total,d.total+122);const b=scenario(d,{births:101,survival:.973,migration:21});assert.ok(Math.abs(b.total-(d.total*.973+122))<=17);}});
