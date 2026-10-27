import {AGES, validateDataset, VERSION} from './core.js';
export const MAX_BYTES=2*1024*1024;
export function parseCSV(text) {
  const rows=[]; let row=[], cell='', quoted=false;
  const input=text.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n');
  for(let i=0;i<input.length;i++) {const ch=input[i];
    if(ch==='"') {if(quoted&&input[i+1]==='"'){cell+='"';i++;}else if(quoted||cell==='') quoted=!quoted;else throw Error('Comillas incorrectas en el CSV.');}
    else if(!quoted&&(ch===','||ch==='\n')) {row.push(cell);cell='';if(ch==='\n'){if(row.some(c=>c!==''))rows.push(row);row=[];}}
    else cell+=ch;
  }
  if(quoted) throw Error('Hay una celda con comillas sin cerrar.');
  row.push(cell);if(row.some(c=>c!==''))rows.push(row);
  if(rows.length<2) throw Error('El CSV no contiene filas de datos.');
  const headers=rows.shift();
  if(new Set(headers).size!==headers.length) throw Error('Hay columnas duplicadas.');
  const required=['id','territory','territoryCode','year','kind','unit','source','sourceUrl','referenceDate','updated','version','method','sexDefinition','limitations','total','age','male','female'];
  if(required.some(x=>!headers.includes(x))) throw Error('Faltan columnas. Descarga la plantilla CSV del laboratorio.');
  const groups=new Map();
  rows.forEach((r,i)=>{
    if(r.length!==headers.length) throw Error(`Fila ${i+2}: número de columnas incorrecto. Usa coma como separador.`);
    const obj=Object.fromEntries(headers.map((h,j)=>[h,r[j]]));
    for(const k of ['year','total','male','female']) {if(!/^\d+$/.test(obj[k])) throw Error(`Fila ${i+2}: ${k} debe ser un entero no negativo.`);obj[k]=Number(obj[k]);}
    const meta=Object.fromEntries(required.filter(k=>!['age','male','female'].includes(k)).map(k=>[k,obj[k]]));
    if(!groups.has(obj.id)) groups.set(obj.id,{...meta,limitations:meta.limitations.split('|'),rows:[],_meta:JSON.stringify(meta)});
    const group=groups.get(obj.id);
    if(group._meta!==JSON.stringify(meta)) throw Error(`Fila ${i+2}: los metadatos cambian dentro del mismo conjunto.`);
    group.rows.push({age:obj.age,male:obj.male,female:obj.female});
  });
  return [...groups.values()].map(({_meta,...d})=>d);
}
export function importText(text,format,existingIds=[]) {
  if(new TextEncoder().encode(text).length>MAX_BYTES) throw Error('El archivo supera 2 MB. Reduce el número de conjuntos.');
  let value;
  try {value=format==='csv'?parseCSV(text):JSON.parse(text);}catch(e){throw Error(`No se pudo leer el archivo: ${e.message}`);}
  const datasets=Array.isArray(value)?value:[value];
  if(!datasets.length||datasets.length>50) throw Error('Importa entre 1 y 50 conjuntos cada vez.');
  const ids=new Set(existingIds);
  const errors=[];
  datasets.forEach((d,i)=>{errors.push(...validateDataset(d).map(e=>`Conjunto ${i+1}: ${e}`));if(ids.has(d?.id))errors.push(`Identificador duplicado: ${d?.id}.`);ids.add(d?.id);});
  if(errors.length) throw Error(errors.join('\n'));
  return datasets.map(d=>({...d,imported:true,limitations:[...d.limitations,'Importación del usuario: la aplicación valida estructura y recuentos, no autentica la procedencia declarada.']}));
}
export const csvCell = value => {
  let cell=String(value??'');
  // Evita fórmulas al abrir exportaciones en hojas de cálculo. Conserva números ordinarios.
  if(typeof value!=='number'&&/^[=+\-@\t\r]/.test(cell))cell="'"+cell;
  return '"'+cell.replace(/"/g,'""')+'"';
};
export function toCSV(datasets) {
  const keys=['id','territory','territoryCode','year','kind','unit','source','sourceUrl','referenceDate','updated','version','method','sexDefinition','limitations','total','age','male','female'];
  const lines=[keys.join(',')];
  for(const d of datasets)for(const row of d.rows)lines.push(keys.map(k=>csvCell(k==='limitations'?d.limitations.join('|'):['age','male','female'].includes(k)?row[k]:d[k])).join(','));
  return '\uFEFF'+lines.join('\r\n');
}
export function saveLocal(storage,value) {try {storage.setItem('demolab-v2',JSON.stringify({version:VERSION,...value}));return true;}catch{return false;}}
export function loadLocal(storage) {try {const d=JSON.parse(storage.getItem('demolab-v2'));return d?.version===VERSION?d:null;}catch{return null;}}
export {AGES};
