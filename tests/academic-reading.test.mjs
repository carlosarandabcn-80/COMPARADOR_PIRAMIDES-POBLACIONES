import test from 'node:test';
import assert from 'node:assert/strict';
import {BANDS,check,describe} from '../lab/comparison-core.mjs';
import {profile,academicComparison,signed} from '../lab/academic-reading.mjs';

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
test('el comentario temporal expresa el año posterior menos el anterior',()=>{
 const a=dataset(),b=dataset(2025,'España','Eurostat','young'),report=academicComparison(a,b);
 assert.equal(report.kind,'temporal');
 assert.equal(report.sections.length,9);
 assert.equal(report.context.equation,'2025 menos 2001');
 assert.match(report.context.heading,/España · 2001 → 2025/);
 assert.ok(report.delta.youth>0);
 assert.ok(report.delta.older<0);
 assert.equal(report.cohorts.rows.length,18);
 assert.match(report.sections.find(s=>s.id==='edades').text,/2025 menos 2001/);
 assert.ok(report.caution.some(note=>note.includes('puntos porcentuales')));
 assert.ok(report.sections.find(s=>s.id==='contexto').text.includes('dos fechas'));
 assert.ok(report.sections.find(s=>s.id==='contexto').text.includes('series de fecundidad'));
});
test('intercambiar A y B conserva las diferencias cronológicas en personas y proporciones',()=>{
 const early=dataset(),late=dataset(2025,'España','Eurostat','young');
 const forward=academicComparison(early,late),reversed=academicComparison(late,early);
 assert.equal(forward.context.equation,reversed.context.equation);
 assert.deepEqual(forward.delta,reversed.delta);
 const deltas=rows=>rows.map(({countDelta,delta,menDelta,womenDelta})=>[countDelta,delta,menDelta,womenDelta]);
 assert.deepEqual(deltas(forward.ageGroups),deltas(reversed.ageGroups));
 assert.deepEqual(deltas(forward.cohorts.rows),deltas(reversed.cohorts.rows));
 assert.equal(forward.ageGroups[0].countA,reversed.ageGroups[0].countB);
 assert.equal(forward.ageGroups[0].a,reversed.ageGroups[0].b);
});
test('la diferencia quinquenal máxima coincide con el cálculo independiente',()=>{
 const a=dataset(),b=dataset(2025,'España','Eurostat','young');
 const r=academicComparison(a,b);
 const ranked=a.cohorts.slice(0,-1).map((c,i)=>{
  const other=b.cohorts[i];
  const delta=100*(other.m+other.f)/b.total-100*(c.m+c.f)/a.total;
  return {label:c.label,delta};
 }).sort((x,y)=>Math.abs(y.delta)-Math.abs(x.delta));
 assert.equal(r.cohorts.largest.delta,ranked[0].delta);
 assert.deepEqual(r.cohorts.largestThree.map(x=>x.label),ranked.slice(0,3).map(x=>x.label));
});
test('los recuentos y los pesos pueden variar en sentidos distintos',()=>{
 const early=dataset(),late=dataset(2025);
 late.cohorts.forEach((cohort,index)=>{
  const multiplier=index<3?2:3;
  cohort.m*=multiplier;
  cohort.f*=multiplier;
 });
 const report=academicComparison(early,late);
 const youth=report.ageGroups[0];
 const lateTotal=late.cohorts.reduce((total,c)=>total+c.m+c.f,0);
 assert.equal(youth.countA,300);
 assert.equal(youth.countB,600);
 assert.equal(youth.countDelta,300);
 assert.equal(youth.b,100*600/lateTotal);
 assert.equal(youth.delta,100*600/lateTotal-100*300/early.total);
 assert.ok(youth.delta<0);
});
test('contraste territorial del mismo año conserva A menos B al desglosar por sexo',()=>{
 const a=dataset(2025,'España'),b=dataset(2025,'Alemania');
 b.cohorts[0].m+=10;
 b.cohorts[0].f-=10;
 const r=academicComparison(a,b),reverse=academicComparison(b,a);
 assert.equal(r.kind,'territorial');
 assert.equal(r.context.equation,'A menos B');
 assert.match(r.context.sources[0],/A · España · 2025/);
 assert.match(r.context.sources[1],/B · Alemania · 2025/);
 const group=r.cohorts.rows[0];
 assert.equal(group.countA,100);
 assert.equal(group.countB,100);
 assert.equal(group.countDelta,0);
 assert.equal(group.delta,0);
 assert.equal(group.menDelta,100*50/a.total-100*60/b.total);
 assert.equal(group.womenDelta,100*50/a.total-100*40/b.total);
 assert.equal(group.menDelta,-reverse.cohorts.rows[0].menDelta);
 assert.equal(group.womenDelta,-reverse.cohorts.rows[0].womenDelta);
 assert.ok(r.sections.find(s=>s.id==='contexto').text.includes('no establece por qué'));
 assert.ok(!r.sections.find(s=>s.id==='contexto').text.includes('aumenta ('));
});
test('mismo territorio y fecha con dos fuentes produce nota de comparabilidad',()=>{
 const r=academicComparison(dataset(2025),dataset(2025,'España','INE','young'));
 assert.equal(r.kind,'fuentes');
 assert.equal(r.context.equation,'A menos B');
 assert.ok(r.sections.find(s=>s.id==='contexto').text.includes('no describen evolución temporal'));
 assert.ok(r.context.warnings.some(text=>text.includes('cobertura')));
 assert.ok(r.caution.some(x=>x.includes('dos operaciones estadísticas')));
});
test('datos de distintos territorios y fechas no se describen como evolución',()=>{
 const r=academicComparison(dataset(2001,'España'),dataset(2025,'Alemania','Eurostat','young'));
 assert.equal(r.kind,'mixta-tiempo-territorio');
 assert.equal(r.context.equation,'A menos B');
 assert.match(r.context.summary,/contraste descriptivo/);
 assert.ok(r.sections.find(s=>s.id==='contexto').text.includes('No puede atribuirse'));
});
test('el contexto temporal avisa de una ruptura dentro del intervalo',()=>{
 const early=dataset(2022,'Alemania'),late=dataset(2024,'Alemania');
 early.meta.seriesBreakYears=[2011,2023];
 late.meta.seriesBreakYears=[2011,2023];
 const forward=academicComparison(early,late),reverse=academicComparison(late,early);
 assert.equal(forward.context.hasBreak,true);
 assert.equal(reverse.context.hasBreak,true);
 assert.equal(forward.context.warnings.length,1);
 assert.match(forward.context.warnings[0],/ruptura de serie.*2023/);
 assert.deepEqual(forward.context.warnings,reverse.context.warnings);
 assert.match(forward.sections.find(s=>s.id==='contexto').text,/teniendo en cuenta ese aviso/);
});
test('el aviso provisional identifica el lado y la fuente de la selección',()=>{
 const a=dataset(2025,'España'),b=dataset(2025,'Francia');
 b.meta.provisional=true;
 b.meta.qualityWarnings=['Eurostat marca datos provisionales en 2025.'];
 const {context}=academicComparison(a,b);
 assert.equal(context.warnings.length,1);
 assert.match(context.warnings[0],/^B · Francia · 2025 · Eurostat marca datos provisionales/);
});
test('las diferencias menores a la precisión visible se expresan como aproximadamente cero',()=>{
 assert.equal(signed(-0.0043),'≈ 0,00');
 assert.equal(signed(0.0043),'≈ 0,00');
 assert.equal(signed(0),'0,00');
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
 assert.equal(r.cohorts.largest,null);
 assert.deepEqual(r.cohorts.largestThree,[]);
 assert.match(r.sections.find(s=>s.id==='conclusion').text,/0,00 puntos porcentuales/);
});
test('fuentes con unidades incompatibles no pueden compararse',()=>{
 const a=dataset(),b=dataset();b.meta.unit='miles';
 assert.throws(()=>academicComparison(a,b),/Unidades diferentes/);
});

test('la banda abierta 85+ no se interpreta como cohorte quinquenal ni domina el ranking',()=>{
 const a=dataset(2001),b=dataset(2025,'España','Eurostat','young');
 for(const d of [a,b]){d.cohorts[17].m=1_000_000;d.cohorts[17].f=2_000_000;}
 const p=profile(a),r=academicComparison(a,b);
 assert.doesNotMatch(describe(a).paragraphs[1],/más numeroso es 85\+/);
 assert.notEqual(p.peak.label,'85+');
 assert.notEqual(r.cohorts.largest.label,'85+');
 assert.ok(r.cohorts.largestThree.every(x=>x.label!=='85+'));
 assert.ok(r.caution.some(x=>x.includes('17 bandas quinquenales')));
 assert.ok(r.sections.find(x=>x.id==='cohortes').text.includes('intervalos quinquenales cerrados'));
 assert.equal(r.cohorts.rows.length,18); // 85+ sigue disponible en la tabla.
});
