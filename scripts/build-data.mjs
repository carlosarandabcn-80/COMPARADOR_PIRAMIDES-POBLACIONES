import fs from 'node:fs';
import crypto from 'node:crypto';
const rawBytes = fs.readFileSync('data/raw/eurostat-demo_pjan.json');
const raw = JSON.parse(rawBytes);
const hash = crypto.createHash('sha256').update(rawBytes).digest('hex');
const query = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_pjan?lang=EN&geo=ES&geo=PT&sex=M&sex=F&sinceTimePeriod=2023&untilTimePeriod=2024';
const get = (keys) => {
  let index = 0;
  raw.id.forEach((id, i) => { const p = raw.dimension[id].category.index[keys[id]]; if (p === undefined) throw Error(`Categoría ausente ${id}`); index = index * raw.size[i] + p; });
  const value = raw.value[index];
  if (!Number.isFinite(value)) throw Error(`Dato ausente ${JSON.stringify(keys)}`);
  return value;
};
const ages = Array.from({length:18}, (_, i) => i === 17 ? '85+' : `${i*5}-${i*5+4}`);
const datasets = [];
for (const geo of ['ES','PT']) for (const year of [2023,2024]) {
  const at = (age, sex) => get({freq:'A',unit:'NR',age,sex,geo,time:String(year)});
  const rows = ages.map((age,i) => {
    const sum = sex => {
      let n = 0;
      for(let a=i*5;a<(i===17?100:i*5+5);a++) n += at(a===0?'Y_LT1':`Y${a}`,sex);
      if(i===17) n += at('Y_OPEN',sex);
      return n;
    };
    return {age,male:sum('M'),female:sum('F')};
  });
  for(const sex of ['M','F']) {
    if(at('UNK',sex)!==0) throw Error('Hay edades desconocidas; requiere política explícita.');
    if(rows.reduce((s,r)=>s+r[sex==='M'?'male':'female'],0)!==at('TOTAL',sex)) throw Error('El total no coincide.');
  }
  datasets.push({id:`${geo}-${year}`,territory:geo==='ES'?'España':'Portugal',territoryCode:geo,year,kind:'observed',unit:'persons',source:'Eurostat',sourceUrl:'https://doi.org/10.2908/demo_pjan',queryUrl:query,referenceDate:`${year}-01-01`,updated:raw.updated,retrieved:'2026-10-27',version:`demo_pjan-${hash.slice(0,12)}`,rawSha256:hash,method:'demo_pjan: población residente a 1 de enero; edad cumplida; sexos M y F según la fuente; agrupación quinquenal y 85+.',sexDefinition:'Males / Females, categorías estadísticas M y F de Eurostat. No mide identidad de género.',license:'Reutilización estadística Eurostat con atribución; agregación propia, Eurostat no es responsable de esta transformación.',limitations:['Datos agregados; no identifican necesidades, ocupación, dependencia funcional ni causas.','No combinar con series de otra definición sin revisar comparabilidad.'],total:at('TOTAL','M')+at('TOTAL','F'),flags:raw.status||{},rows});
}
const names = ['Expansiva','Campana','Base reducida','Romboidal','Perfil rural didáctico','Concentración adulta','Concentración juvenil','Cúspide amplia','Cohortes irregulares','Cohorte numerosa','Muy envejecida','Muy joven','Perfil adulto irregular'];
JSON.parse(fs.readFileSync('data/legacy-shapes.json')).forEach((d,i)=>{
  const weights=d.male.concat(d.female), sum=weights.reduce((a,b)=>a+b,0);
  const values=weights.map(v=>Math.floor(v/sum*100000));
  const remainder=100000-values.reduce((a,b)=>a+b,0);
  weights.map((v,j)=>({j,r:v/sum*100000-values[j]})).sort((a,b)=>b.r-a.r||a.j-b.j).slice(0,remainder).forEach(({j})=>values[j]++);
  datasets.push({id:`model-${d.id}`,territory:`Modelo · ${names[i]}`,territoryCode:`model-${d.id}`,year:2026,kind:'synthetic',unit:'persons',source:'Modelos del comparador original; normalización propia',sourceUrl:'https://github.com/carlosarandabcn-80/COMPARADOR_PIRAMIDES-POBLACIONES',referenceDate:'Sin fecha real',updated:'2026-10-27',retrieved:'2026-10-27',version:'didacticos-2',method:'Pesos originales normalizados a 100 000 personas ficticias mediante restos mayores. Año 2026 identifica la edición, no un periodo observado.',sexDefinition:'Dos categorías didácticas hombre y mujer; no representa un censo.',license:'Material heredado; derechos del titular original. No se concede licencia nueva.',limitations:['Modelo sintético; no describe ningún país o municipio real.','El perfil no prueba migración, fecundidad, pobreza ni necesidades.'],total:100000,rows:ages.map((age,j)=>({age,male:values[j],female:values[j+18]}))});
});
fs.writeFileSync('data/datasets.json', JSON.stringify(datasets,null,2)+'\n');
console.log(`${datasets.length} conjuntos; SHA-256 original ${hash}`);
