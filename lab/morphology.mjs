/**
 * Biblioteca didáctica de perfiles demográficos para Estructura Social.
 * Tres familias morfológicas y nueve descriptores complementarios.
 * No son clases oficiales del INE ni Eurostat. Los dibujos son sintéticos.
 */
export const MODELS = Object.freeze([
 {id:'expansiva',title:'Expansiva clásica',kind:'Familia básica',detail:'Base amplia y estrechamiento progresivo hacia las edades mayores.',limit:'Una base ancha no identifica por sí sola tasas ni causas de fecundidad.',weights:[1,.95,.88,.82,.76,.70,.64,.58,.51,.44,.38,.32,.25,.19,.13,.09,.06,.04]},
 {id:'estacionaria',title:'Estacionaria',kind:'Familia básica',detail:'Base y cuerpo de amplitud relativamente comparable.',limit:'La silueta no demuestra que el volumen total permanezca estable.',weights:[.72,.75,.77,.78,.79,.79,.79,.79,.78,.77,.75,.72,.68,.60,.53,.44,.34,.26]},
 {id:'regresiva',title:'Regresiva',kind:'Familia básica',detail:'Base estrecha respecto a los grupos adultos y peso relevante de cohortes maduras.',limit:'La forma no descompone los efectos de nacimientos, mortalidad o movilidad.',weights:[.32,.38,.46,.53,.62,.72,.84,.95,1,.98,.91,.84,.76,.68,.58,.46,.34,.27]},
 {id:'expansiva-moderada',title:'Expansiva moderada',kind:'Subtipo docente',detail:'Base todavía ancha, con pendiente menos acusada que en el esquema expansivo clásico.',limit:'Los límites con una figura mixta son graduales.',weights:[.89,.88,.86,.83,.81,.77,.72,.68,.62,.57,.50,.44,.37,.30,.24,.18,.11,.07]},
 {id:'mixta',title:'Mixta o de transición',kind:'Subtipo docente',detail:'Combina rasgos expansivos, estacionarios y regresivos.',limit:'La categoría reconoce incertidumbre y evita clasificaciones forzadas.',weights:[.63,.65,.67,.72,.78,.84,.88,.86,.81,.79,.76,.70,.63,.56,.45,.35,.26,.19]},
 {id:'invertida',title:'Regresiva avanzada o invertida',kind:'Subtipo docente',detail:'Base muy estrecha y concentración relativa en edades intermedias y superiores.',limit:'No debe interpretarse como predicción inevitable.',weights:[.18,.21,.25,.29,.38,.48,.61,.72,.84,.96,1,.99,.95,.86,.76,.65,.52,.42]},
 {id:'envejecimiento-intenso',title:'Envejecimiento intenso',kind:'Patrón adicional',detail:'Peso elevado de 65+ y presencia relevante de edades muy avanzadas.',limit:'El tramo 85+ es abierto y no equivale a una cohorte quinquenal.',weights:[.20,.25,.30,.35,.40,.48,.55,.62,.69,.78,.86,.95,.98,1,.96,.90,.79,.68]},
 {id:'abultamiento',title:'Abultamiento generacional',kind:'Patrón adicional',detail:'Cohortes consecutivas sobresalen sobre las adyacentes.',limit:'Un saliente no acredita por sí solo un baby boom.',weights:[.38,.42,.47,.53,.60,.67,.79,1,1,.82,.69,.62,.56,.48,.37,.28,.19,.14]},
 {id:'muesca',title:'Muesca generacional',kind:'Patrón adicional',detail:'Descenso local entre cohortes próximas.',limit:'No identifica automáticamente guerras, epidemias o emigración.',weights:[.64,.67,.71,.75,.78,.82,.45,.87,.84,.80,.74,.69,.61,.53,.42,.33,.23,.17]},
 {id:'adultos',title:'Concentración adulta joven',kind:'Patrón adicional',detail:'Ensanchamiento de las edades adultas jóvenes frente a tramos adyacentes.',limit:'Compatible con varios procesos, entre ellos movimientos migratorios, sin probarlos.',weights:[.32,.36,.43,.56,.76,.94,1,.99,.86,.68,.58,.48,.40,.33,.25,.17,.10,.07]},
 {id:'deficit',title:'Déficit relativo de adultos jóvenes',kind:'Patrón adicional',detail:'Estrechamiento relativo de los adultos jóvenes frente a edades adultas posteriores.',limit:'No puede atribuirse a emigración sin información complementaria.',weights:[.45,.48,.52,.40,.34,.36,.43,.67,.87,1,.94,.82,.70,.58,.46,.32,.21,.15]},
 {id:'asimetria',title:'Asimetría por sexo',kind:'Patrón adicional',detail:'Diferencias significativas entre los dos lados de la pirámide.',limit:'Las causas de la diferencia requieren evidencia externa.',weights:[.58,.60,.63,.67,.73,.78,.84,.88,.89,.86,.82,.77,.68,.59,.49,.38,.28,.21]}
]);
/**
 * Solo observa perfiles por sexo y edad. Umbrales exploratorios,
 * explícitos y no validados para clasificación oficial.
 */
export function recognizeMorphology(cohorts){
 if(!Array.isArray(cohorts)||cohorts.length!==18||cohorts.some(c=>!Number.isFinite(c.m)||!Number.isFinite(c.f)||c.m<0||c.f<0))throw new Error('Cohortes incompatibles');
 const n=cohorts.map(c=>c.m+c.f),sum=(start,end)=>n.slice(start,end).reduce((a,b)=>a+b,0);
 const total=sum(0,18);if(!total)throw new Error('Total nulo');
 const younger=sum(0,3),adults=sum(6,9),old=sum(13,18),ratio=adults?younger/adults:null,oldShare=100*old/total;
 let family='Mixta o de transición';
 if(ratio!==null&&ratio>=1.25&&oldShare<15)family='Compatible con expansiva';
 else if(ratio!==null&&ratio<=.8)family='Compatible con regresiva';
 else if(ratio!==null&&ratio>.8&&ratio<1.25)family='Compatible con estacionaria o de transición';
 const patterns=[];
 if(ratio!==null&&ratio>=1.25&&ratio<1.6)patterns.push({id:'expansiva-moderada',label:'Base expansiva moderada',evidence:'Cociente base/adultos de '+ratio.toFixed(2)});
 if(oldShare>=25)patterns.push({id:'envejecimiento-intenso',label:'Peso elevado de 65+',evidence:oldShare.toFixed(2)+' % de 65+'});
 if(ratio!==null&&ratio<.55&&oldShare>=20)patterns.push({id:'invertida',label:'Base muy reducida y envejecimiento',evidence:'Cociente base/adultos de '+ratio.toFixed(2)});
 const bulges=[],notches=[];
 // Se excluyen los extremos y el tramo abierto 85+ de toda comparación local.
 for(let i=2;i<=15;i++){
  const neighbours=(n[i-1]+n[i+1])/2;if(neighbours<=0)continue;
  if(n[i]>=1.18*neighbours)bulges.push({i,score:n[i]/neighbours});
  if(n[i]<=.82*neighbours)notches.push({i,score:n[i]/neighbours});
 }
 const age=i=>i*5+'–'+(i*5+4);
 if(bulges.length){const p=bulges.sort((a,b)=>b.score-a.score)[0];patterns.push({id:'abultamiento',label:'Saliente local en '+age(p.i),evidence:(100*(p.score-1)).toFixed(1)+' % sobre los intervalos vecinos'});}
 if(notches.length){const p=notches.sort((a,b)=>a.score-b.score)[0];patterns.push({id:'muesca',label:'Muesca local en '+age(p.i),evidence:(100*(1-p.score)).toFixed(1)+' % bajo los intervalos vecinos'});}
 const youngAdult=sum(4,8),middleAdult=sum(8,12),adultRatio=middleAdult?youngAdult/middleAdult:null;
 if(adultRatio!==null&&adultRatio>=1.3)patterns.push({id:'adultos',label:'Concentración relativa de 20–39',evidence:'Cociente 20–39/40–59 de '+adultRatio.toFixed(2)});
 if(adultRatio!==null&&adultRatio<=.75)patterns.push({id:'deficit',label:'Déficit relativo de 20–39',evidence:'Cociente 20–39/40–59 de '+adultRatio.toFixed(2)});
 const womenOld=cohorts.slice(13).reduce((s,c)=>s+c.f,0),femaleOldShare=old?100*womenOld/old:null;
 if(femaleOldShare!==null&&(femaleOldShare>=60||femaleOldShare<=40))patterns.push({id:'asimetria',label:'Asimetría por sexo en 65+',evidence:femaleOldShare.toFixed(2)+' % de mujeres entre las personas de 65+'});
 return {family,ratio,oldShare,patterns,criteria:'Base 0–14 frente a 30–44, peso de 65+; perfiles locales frente a cohortes adyacentes (excluido 85+). Umbrales didácticos no oficiales.'};
}
