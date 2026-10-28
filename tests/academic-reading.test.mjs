import test from 'node:test';
import assert from 'node:assert/strict';
import {BANDS,check} from '../lab/comparison-core.mjs';
import {profile,academicComparison} from '../lab/academic-reading.mjs';

function dataset(year=2001,place='España',provider='Eurostat',mode='older'){
 const cohorts=BANDS.map((b,i)=>{
  const size=mode==='older'?(i<3?50:i>=13?250:120):(i<3?220:i>=13?40:140);
  return {...b,m:size,f:i>=13?size*2:size};
 });
 return check({meta:{kind:'oficial',provider,place,year,unit:'personas',referenceDate:year+'-01-01'},cohorts});
}
test('morfología, pico y proporciones son coherentes con efectivos de origen',()=>{
 const a=profile(dataset()),total=a.cohorts.reduce((n,b)=>n+b.total,0);
 assert.equal(a.total,total);
 assert.equal(a.shares.older,100*a.groups.older/a.total);
 assert.equal(a.cohorts[17].label,'85+');
 assert.ok(a.peak.label);
 assert.ok(Math.abs(a.shares.olderWomen-200/300*100)<1e-10);
});
test('comentario identifica diferencias exactas A menos B en puntos porcentuales',()=>{
 const a=dataset(),b=dataset(2025,'España','Eurostat','young'),report=academicComparison(a,b);
 assert.equal(report.kind,'temporal');
 assert.equal(report.sections.length,9);
 assert.ok(report.delta.youth<0);
 assert.ok(report.delta.older>0);
 assert.equal(report.cohorts.rows.length,18);
 assert.ok(report.sections.find(s=>s.id==='edades').text.includes('puntos porcentuales'));
 assert.ok(report.sections.find(s=>s.id==='contexto').text.includes('dos fechas'));
 assert.ok(report.sections.find(s=>s.id==='contexto').text.includes('series de fecundidad'));
});
test('la diferencia quinquenal máxima coincide con el cálculo independiente',()=>{
 const a=dataset(),b=dataset(2025,'España','Eurostat','young');
 const r=academicComparison(a,b);
 const diffs=Array.from({length:18},(_,i)=>100*(a.cohorts[i].m+a.cohorts[i].f)/a.total-100*(b.cohorts[i].m+b.cohorts[i].f)/b.total);
 assert.ok(Math.abs(r.cohorts.largest.delta-Math.max(...diffs.map(Math.abs))*Math.sign(r.cohorts.largest.delta))<1e-9);
 assert.deepEqual(r.cohorts.largestThree.map(x=>x.label),[...r.cohorts.rows].sort((x,y)=>Math.abs(y.delta)-Math.abs(x.delta)).slice(0,3).map(x=>x.label));
});
test('contraste entre países mismo año no se confunde con evolución demográfica',()=>{
 const r=academicComparison(dataset(2025,'España'),dataset(2025,'Alemania','Eurostat','young'));
 assert.equal(r.kind,'territorial');
 assert.ok(r.sections.find(s=>s.id==='contexto').text.includes('no establece por qué'));
 assert.ok(!r.sections.find(s=>s.id==='contexto').text.includes('aumenta ('));
});
test('mismo territorio y fecha con dos fuentes produce nota de comparabilidad',()=>{
 const r=academicComparison(dataset(2025),dataset(2025,'España','INE','young'));
 assert.equal(r.kind,'fuentes');
 assert.ok(r.sections.find(s=>s.id==='contexto').text.includes('no describen evolución temporal'));
 assert.ok(r.caution.some(x=>x.includes('dos operaciones estadísticas')));
});
test('datos de distintos territorios y fechas no se describen como evolución',()=>{
 const r=academicComparison(dataset(2001,'España'),dataset(2025,'Alemania','Eurostat','young'));
 assert.equal(r.kind,'mixta-tiempo-territorio');
 assert.ok(r.sections.find(s=>s.id==='contexto').text.includes('No puede atribuirse'));
});
test('casos límite: tramo sin mujeres mayores y cero población infantil',()=>{
 const zero=dataset();
 zero.cohorts.slice(0,3).forEach(c=>{c.m=0;c.f=0});
 zero.cohorts.slice(13).forEach(c=>{c.f=0});
 const a=profile(zero);
 assert.equal(a.metrics.ageing,null);
 assert.equal(a.shares.olderWomen,0);
 const r=academicComparison(zero,dataset(2025));
 assert.ok(r.sections.find(s=>s.id==='indicadores').text.includes('no calculable'));
 assert.ok(!r.fullText.includes('Infinity'));
 assert.ok(!r.fullText.includes('NaN'));
});
test('mismo territorio, año y fuente se rotula como control, no cambio',()=>{
 const r=academicComparison(dataset(),dataset());
 assert.equal(r.kind,'misma-seleccion');
 assert.ok(r.sections.find(s=>s.id==='conclusion').text.includes('coincidencia'));
 assert.equal(r.delta.youth,0);
});
test('fuentes con unidades incompatibles no pueden compararse',()=>{
 const a=dataset(),b=dataset();b.meta.unit='miles';
 assert.throws(()=>academicComparison(a,b),/Unidades diferentes/);
});

test('la banda abierta 85+ no se interpreta como cohorte quinquenal ni domina el ranking',()=>{
 const a=dataset(2001),b=dataset(2025,'España','Eurostat','young');
 for(const d of [a,b]){d.cohorts[17].m=1_000_000;d.cohorts[17].f=2_000_000;}
 const p=profile(a),r=academicComparison(a,b);
 assert.notEqual(p.peak.label,'85+');
 assert.notEqual(r.cohorts.largest.label,'85+');
 assert.ok(r.cohorts.largestThree.every(x=>x.label!=='85+'));
 assert.ok(r.caution.some(x=>x.includes('17 bandas quinquenales')));
 assert.ok(r.sections.find(x=>x.id==='cohortes').text.includes('intervalos quinquenales cerrados'));
 assert.equal(r.cohorts.rows.length,18); // 85+ sigue disponible en la tabla.
});
