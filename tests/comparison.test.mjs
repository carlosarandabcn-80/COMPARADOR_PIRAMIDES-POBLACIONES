import test from 'node:test';
import assert from 'node:assert/strict';
import {BANDS,check,indicators,status,classify,describe,compare,eurostatURL,fromEurostat,ineURL,parseINE,INE_TERRITORIES,ineTerritoryURL,parseINETerritory,serializeCSV} from '../lab/comparison-core.mjs';
import {MODELS,recognizeMorphology} from '../lab/morphology.mjs';
const make=(provider='Eurostat',year=2025)=>check({meta:{provider,kind:'oficial',place:'España',unit:'personas',year,referenceDate:year+'-01-01',sourceUrl:'https://example.org',updatedAt:'test',note:''},cohorts:BANDS.map((b,i)=>({...b,m:100-i,f:90-i}))});
function sampleGrouped(geo='DE',year=2009){
 const codes=['TOTAL',...BANDS.map((b,i)=>i===0?'Y_LT5':i===17?'Y_GE85':'Y'+(i*5)+'-'+(i*5+4)),'UNK'];
 const idx=a=>Object.fromEntries(a.map((v,i)=>[v,i]));
 const value={};let totalM=0,totalF=0;
 for(let i=1;i<=18;i++){value[codes.length+i]=1000+i;value[2*codes.length+i]=900+i;totalM+=1000+i;totalF+=900+i;}
 // T, M, F are the published sex positions; simulated T group values are optional.
 value[codes.length]=totalM;value[2*codes.length]=totalF;value[2*codes.length-1]=0;value[3*codes.length-1]=0;
 return {id:['freq','unit','sex','age','geo','time'],size:[1,1,3,codes.length,1,1],
 dimension:{freq:{category:{index:{A:0}}},unit:{category:{index:{NR:0}}},sex:{category:{index:{T:0,M:1,F:2}}},
  age:{category:{index:idx(codes)}},geo:{category:{index:{[geo]:0}}},time:{category:{index:{[year]:0}}}},
 value,updated:'2026-09-25'};
}
test('cohortes e indicadores reales agregados',()=>{
 const d=make(),i=indicators(d);assert.equal(d.cohorts.length,18);
 assert.equal(i.total,BANDS.reduce((s,b,k)=>s+190-2*k,0));
 assert.equal(i.men,18*100-153);assert.equal(i.women,18*90-153);
 assert.equal(Math.round(i.pYouth+i.pActive+i.pOld),100);
 assert.ok(classify(d).type);assert.equal(describe(d).paragraphs.length,5);
});
test('comparar ambas fuentes y mostrar puntos porcentuales',()=>{
 const r=compare(make('Eurostat'),make('INE'));
 assert.equal(r.rows.length,6);assert.equal(r.rows[2].delta,0);assert.equal(status(make(),make('INE')).ok,true);
});
test('rechazar invalidaciones y unidades distintas',()=>{
 let d=make();d.cohorts[0].m=-1;assert.throws(()=>check(d));
 d=make();d.meta.kind='sintetico';assert.throws(()=>check(d));
 d=make();d.cohorts[1].label='5-9';assert.throws(()=>check(d));
 let b=make();b.meta.unit='miles';assert.equal(status(make(),b).ok,false);
});
test('URL Eurostat consulta demo_pjangroup y solo años publicados',()=>{
 const u=new URL(eurostatURL('DE',2009));assert.match(u.pathname,/demo_pjangroup$/);
 assert.equal(u.searchParams.get('geo'),'DE');assert.deepEqual(u.searchParams.getAll('sex'),['M','F']);
 assert.throws(()=>eurostatURL('DE',2026));
});
test('Alemania 2009: 85+ agregado Y_GE85, sin exigir edad 95 inexistente',()=>{
 const json=sampleGrouped('DE',2009),d=fromEurostat(json,'DE',2009);
 assert.equal(d.meta.provider,'Eurostat');assert.equal(d.meta.table,'demo_pjangroup');assert.equal(d.cohorts[17].m,1018);
 assert.equal(d.total,18*1900+2*171);
});
test('no inventar cohortes ausentes ni conciliar totales discrepantes',()=>{
 let j=sampleGrouped();delete j.value[20+17];assert.throws(()=>fromEurostat(j,'DE',2009),/falta un dato oficial/);
 j=sampleGrouped();j.value[20]+=50;assert.throws(()=>fromEurostat(j,'DE',2009),/discrepancia/);
 j=sampleGrouped();assert.throws(()=>fromEurostat(j,'ES',2009),/no ofrece/);
});
test('INE mantiene todas las edades exportadas y rechaza series vacías',()=>{
 assert.equal(serializeCSV(make('INE')).split('\n').length,20);
 assert.throws(()=>parseINE([],2025),/falta edad/);
 assert.equal(ineURL(2001).includes('20010101:20010101'),true);
});

function territoryFixture(code,year,omit=null){
 const title=code==='CT'?'Cataluña':code==='BCN_P'?'Barcelona':code==='BCN_M'?'08019 Barcelona':"08101 L'Hospitalet de Llobregat";
 const grouped=code.endsWith('_M'),a=[];
 let men=0,women=0;
 const ages=grouped?[...Array.from({length:20},(_,i)=>'De '+i*5+' a '+(i*5+4)+' años'),'De 100 y más años']:
  [...Array.from({length:100},(_,i)=>i+' años'),'100 y más años'];
 for(const [k,sex] of [['m','Hombres'],['f','Mujeres']]){
  let total=0;
  ages.forEach((label,i)=>{
   const v=100+i+(k==='f'?20:0);total+=v;
   if(label===omit)return;
   a.push({Nombre:title+'. '+label+'. '+sex+'. Población. Número.',Data:[{Anyo:year,Valor:v}]});
  });
  if(k==='m')men=total;else women=total;
  a.push({Nombre:title+'. Todas las edades. '+sex+'. Población. Número.',Data:[{Anyo:year,Valor:total}]});
 }
 return a;
}
test('biblioteca de doce modelos distingue tres familias y nueve descriptores',()=>{
 assert.equal(MODELS.length,12);
 assert.equal(MODELS.filter(x=>x.kind==='Familia básica').length,3);
 assert.equal(new Set(MODELS.map(x=>x.id)).size,12);
 assert.ok(MODELS.every(x=>x.weights.length===18&&x.detail&&x.limit));
});
test('reconocimiento morfológico identifica patrones, sin diagnosticar causas',()=>{
 const cohorts=BANDS.map((b,i)=>({...b,m:i===8?1000:200,f:i===8?1400:220}));
 const r=recognizeMorphology(cohorts);
 assert.equal(typeof r.family,'string');assert.ok(r.patterns.some(p=>p.id==='abultamiento'));
 assert.ok(r.patterns.every(p=>p.evidence&&!/migraci[oó]n.*demostr/i.test(p.evidence)));
});
test('INE territorial: localidades y fechas con cohortes completas',()=>{
 for(const code of ['CT','BCN_P','BCN_M','HOSP_M']){
  const year=2025,tab=INE_TERRITORIES[code].table;
  assert.ok(ineTerritoryURL(code,year).includes('/'+tab+'?'));
  const d=parseINETerritory(territoryFixture(code,year),code,year);
  assert.equal(d.cohorts.length,18);assert.equal(d.meta.table,tab);
  assert.equal(d.meta.place,INE_TERRITORIES[code].title);
 }
 assert.throws(()=>ineTerritoryURL('BCN_M',2026));
});
test('INE territorial: faltantes, territorios erróneos y duplicados bloqueados',()=>{
 assert.throws(()=>parseINETerritory(territoryFixture('CT',2025,'3 años'),'CT',2025),/falta/);
 assert.throws(()=>parseINETerritory(territoryFixture('CT',2025),'BCN_P',2025),/falta/);
 const a=territoryFixture('BCN_M',2025);a.push(a[0]);
 assert.throws(()=>parseINETerritory(a,'BCN_M',2025),/duplicada/);
});
