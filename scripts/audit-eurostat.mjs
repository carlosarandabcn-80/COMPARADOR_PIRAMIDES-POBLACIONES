const base='https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/';
for(const dataset of ['demo_pjan','demo_pjangroup']){
 for(const [geo,year] of [['DE',2009],['ES',2025],['ES',2001]]){
  const u=base+dataset+'?'+new URLSearchParams({geo,time:String(year),unit:'NR',freq:'A',lang:'EN',format:'JSON'});
  try{
   const r=await fetch(u,{signal:AbortSignal.timeout(45000)});
   console.log('PROBE',dataset,geo,year,r.status);
   if(!r.ok){console.log((await r.text()).slice(0,300));continue;}
   const j=await r.json(),age=j.dimension?.age?.category?.index,sex=j.dimension?.sex?.category?.index;
   console.log('META',JSON.stringify({dimensions:j.id,size:j.size,ages:Object.keys(age||{}),sex,updated:j.updated}).slice(0,1700));
   const idx=(x,y,z)=>{let off=0;const arr=j.size,dim=j.dimension; for(let i=0;i<j.id.length;i++){const id=j.id[i],v=dim[id].category.index[{geo:x,time:String(y),sex:z,unit:'NR',freq:'A',age:'TOTAL'}[id]];if(v===undefined)return null;off+=v*arr.slice(i+1).reduce((a,b)=>a*b,1);}return j.value?.[off]??null;};
   console.log('TOTALS',idx(geo,year,'M'),idx(geo,year,'F'),idx(geo,year,'W'));
   if(dataset==='demo_pjan'){
    for(const a of ['Y90','Y94','Y95','Y96','Y97','Y98','Y99','Y_OPEN','UNK','Y_GE95'])console.log('AGE',a,age?.[a]??'absent',JSON.stringify(j.status||{}).slice(0,80));
    const act=(code,sex)=>{const parts={geo,time:String(year),unit:'NR',freq:'A',sex,age:code},steps=j.size.map((_,i)=>j.size.slice(i+1).reduce((a,b)=>a*b,1));let offset=0;for(const [i,id]of j.id.entries()){const ix=j.dimension[id]?.category?.index?.[parts[id]];if(ix===undefined)return undefined;offset+=ix*steps[i];}return j.value?.[offset]}; 
    console.log('SENIOR_M',JSON.stringify(['Y94','Y95','Y96','Y97','Y98','Y99','Y_OPEN'].map(a=>[a,act(a,'M')]))); 
   }
   if(dataset==='demo_pjangroup'){const val=(code,sex)=>{let off=0;const parts={age:code,sex,geo,time:String(year),unit:'NR',freq:'A'};for(let i=0;i<j.id.length;i++){const key=parts[j.id[i]],v=j.dimension[j.id[i]].category.index[key];if(v===undefined)return undefined;off+=v*j.size.slice(i+1).reduce((a,b)=>a*b,1);}return j.value?.[off];};for(const s of ['M','F','W'])console.log('GROUP_'+s,JSON.stringify(['Y_LT5','Y5-9','Y80-84','Y_GE85'].map(a=>[a,val(a,s)]))); }
  }catch(err){console.log('ERROR',dataset,geo,year,String(err));}
 }
}