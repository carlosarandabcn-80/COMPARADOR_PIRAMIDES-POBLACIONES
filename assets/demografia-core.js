/* Laboratorio: núcleo estadístico explícito, independiente de interfaz y servicios. */
(function(root){"use strict";
const BANDS=["0-4","5-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75-79","80-84","85+"];
function sex(s){let t=String(s||"").trim().toLowerCase();if(["h","hombre","hombres","masculino","male"].includes(t))return "H";if(["m","mujer","mujeres","femenino","female"].includes(t))return "M";throw Error("Sexo no reconocido: "+s+". Utiliza H o M (categorías de la fuente).");}
function count(x){return (typeof x==="number"||typeof x==="string"&&x.trim()!=="")&&Number.isSafeInteger(Number(x))&&Number(x)>=0;}
function validate(rows,meta){
 if(!Array.isArray(rows)||!rows.length)throw Error("Se requieren 36 registros: 18 edades por dos sexos.");
 const seen=new Map();rows.forEach((r,i)=>{if(!r||typeof r!=="object")throw Error("Fila "+(i+1)+": registro inválido.");let a=String(r.grupo_edad??r.edad??"").trim();if(!BANDS.includes(a))throw Error("Fila "+(i+1)+": grupo no admitido: "+a);
 let s=sex(r.sexo),v=r.poblacion??r.valor;if(!count(v))throw Error("Fila "+(i+1)+": población no es entero no negativo.");if(seen.has(a+"|"+s))throw Error("Duplicado: "+a+"/"+s);seen.set(a+"|"+s,Number(v));});
 let missing=[];for(const a of BANDS)for(const s of ["H","M"])if(!seen.has(a+"|"+s))missing.push(a+"/"+s);
 if(missing.length)throw Error("Faltan "+missing.length+" registros: "+missing.slice(0,8).join(", ")+(missing.length>8?"…":""));
 if(rows.length!==36)throw Error("Número inesperado de filas.");
 const bandas=BANDS.map(edad=>({edad,hombres:seen.get(edad+"|H"),mujeres:seen.get(edad+"|M")}));
 let total=0;for(const x of bandas){total+=x.hombres+x.mujeres;if(!Number.isSafeInteger(total))throw Error("Total excede el entero seguro.");}
 if(!total)throw Error("La población total es cero.");
 const m=meta||{};return {id:String(m.id||"importado").slice(0,70),nombre:String(m.territorio||"Conjunto importado").trim().slice(0,120),periodo:String(m.periodo||"Sin especificar").slice(0,60),fuente:String(m.fuente||"Procedencia sin acreditar").slice(0,250),tipo:String(m.tipo||"importado"),verificado:false,bandas,total};
}
function divide(a,b){return b?100*a/b:null;}
function sum(a){return a.reduce((s,x)=>s+x.hombres+x.mujeres,0);}
function indicators(d){
 const a=d.bandas,y=sum(a.slice(0,3)),w=sum(a.slice(3,13)),o=sum(a.slice(13)),h=a.reduce((s,x)=>s+x.hombres,0),m=a.reduce((s,x)=>s+x.mujeres,0),total=y+w+o;
 if(total!==d.total)throw Error("Incoherencia del total.");
 return {total,men:h,women:m,young:y,working:w,older:o,youthShare:divide(y,total),olderShare:divide(o,total),youthDependency:divide(y,w),oldDependency:divide(o,w),totalDependency:divide(y+o,w),ageingIndex:divide(o,y),sexRatio:divide(h,m)};
}
function compare(a,b){const x=indicators(a),y=indicators(b);return {oldShareDeltaPP:y.olderShare-x.olderShare,youngShareDeltaPP:y.youthShare-x.youthShare,totalDelta:y.total-x.total,oldDependencyDelta:x.oldDependency===null||y.oldDependency===null?null:y.oldDependency-x.oldDependency};}
function csvRows(text){
 if(typeof text!=="string"||text.length>3000000)throw Error("Archivo demasiado grande o vacío.");
 const first=(text.replace(/^\uFEFF/,"").split(/\r?\n/)[0]||"");
 const delim=[";",",","\t"].sort((a,b)=>first.split(b).length-first.split(a).length)[0],lines=[];let cell="",row=[],quotes=false;
 for(let i=0;i<text.length;i++){let c=text[i];if(c==='"'){if(quotes&&text[i+1]==='"'){cell+='"';i++;}else quotes=!quotes;}
 else if(!quotes&&c===delim){row.push(cell.trim());cell="";}
 else if(!quotes&&(c==="\r"||c==="\n")){if(c==="\r"&&text[i+1]==="\n")i++;row.push(cell.trim());cell="";if(row.some(x=>x!==""))lines.push(row);row=[];}else cell+=c;}
 if(quotes)throw Error("CSV: comillas sin cerrar.");row.push(cell.trim());if(row.some(x=>x!==""))lines.push(row);
 if(lines.length<2)throw Error("CSV sin datos.");
 const heads=lines.shift().map(x=>x.toLowerCase().replace(/^\uFEFF/,""));for(const k of ["grupo_edad","sexo","poblacion"])if(!heads.includes(k))throw Error("Falta la columna: "+k);
 return lines.map((r,i)=>{if(r.length!==heads.length)throw Error("Fila "+(i+2)+": columnas inconsistentes.");let o={};heads.forEach((h,j)=>o[h]=r[j]);return o;});
}
function importText(txt,file,fuente,territorio,periodo){
 if(typeof txt!=="string"||txt.length>3000000)throw Error("Archivo demasiado grande (límite 3 MB).");
 let rows,meta={};if(/\.json$/i.test(file)){let obj;try{obj=JSON.parse(txt)}catch(e){throw Error("JSON mal formado.");}rows=Array.isArray(obj)?obj:obj.registros;meta=!Array.isArray(obj)?obj.metadatos||{}:{};}else if(/\.csv$/i.test(file))rows=csvRows(txt);else throw Error("Solo se admiten archivos CSV/JSON.");
 return validate(rows,{id:"importado-"+Date.now(),territorio:territorio||meta.territorio||file,periodo:periodo||meta.periodo||"Sin especificar",fuente:fuente||meta.fuente||"Declarada por quien importa",tipo:"importado"});
}
function synthetic(id,nombre,m,f){
 let r=[];BANDS.forEach((a,i)=>{r.push({grupo_edad:a,sexo:"H",poblacion:m[i]});r.push({grupo_edad:a,sexo:"M",poblacion:f[i]});});
 return validate(r,{id,territorio:nombre,periodo:"Escenario didáctico",tipo:"sintetico",fuente:"Modelo ficticio. No representa a ninguna población real."});
}
const SYNTHETIC=[
 synthetic("joven","Territorio A · perfil joven",[820,790,765,710,670,610,570,520,480,440,400,360,330,270,220,170,110,65],[780,760,730,690,650,600,570,535,500,465,430,405,380,340,285,230,175,120]),
 synthetic("mayor","Territorio B · perfil envejecido",[215,230,250,275,310,365,410,450,510,570,615,655,690,665,620,520,370,230],[205,225,245,280,320,375,430,475,540,605,660,705,760,755,730,645,515,420]),
 synthetic("mixto","Territorio C · perfil intermedio",[440,450,460,455,470,490,520,560,590,600,580,540,500,435,360,290,210,125],[420,435,450,445,465,490,530,570,610,630,625,585,555,495,420,355,280,220])
];
function describe(a,b){const x=indicators(a),y=indicators(b),d=compare(a,b),f=v=>v===null?"no calculable":v.toFixed(1);
 return {observacion:"En "+a.nombre+", "+f(x.youthShare)+" % tiene 0–14 años y "+f(x.olderShare)+" % tiene 65 o más. En "+b.nombre+", los valores son "+f(y.youthShare)+" % y "+f(y.olderShare)+" %.",
 contraste:"La proporción de 65+ cambia "+(d.oldShareDeltaPP>=0?"+":"")+f(d.oldShareDeltaPP)+" puntos porcentuales de A a B. Son diferencias descriptivas, no pruebas causales ni diagnósticos de necesidades.",
 regla:"R-01: proporción = grupo / total × 100. R-02: diferencia en puntos porcentuales = porcentaje B − porcentaje A.",
 limitacion:"Datos sintéticos o importados sin validación oficial automatizada. Dependencia definida aquí con 0–14/15–64/65+, no necesariamente equivalente a otras series oficiales."};
}
root.DemoCore=Object.freeze({BANDS,SYNTHETIC,validate,indicators,compare,csvRows,importText,describe});
})(typeof window!=="undefined"?window:globalThis);