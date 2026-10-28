import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
function eurostatFixture(url){
 const p=new URL(url).searchParams,geo=p.get('geo');
 const times=p.get('time')?[p.get('time')]:['2001','2009','2025'];
 const ages=['TOTAL',...Array.from({length:18},(_,i)=>i===0?'Y_LT5':i===17?'Y_GE85':'Y'+(i*5)+'-'+(i*5+4)),'UNK'];
 const idx=a=>Object.fromEntries(a.map((v,i)=>[v,i]));
 const value={};let totalM=0,totalF=0;
 for(let time=0;time<times.length;time++){
  totalM=0;totalF=0;
  for(let i=1;i<=18;i++){
   const m=1000+i*2+time,f=1100+i*2+time;
   value[(ages.length+i)*times.length+time]=m;
   value[(2*ages.length+i)*times.length+time]=f;
   totalM+=m;totalF+=f;
  }
  value[ages.length*times.length+time]=totalM;
  value[2*ages.length*times.length+time]=totalF;
  value[(2*ages.length-1)*times.length+time]=0;
  value[(3*ages.length-1)*times.length+time]=0;
 }
 return {id:['freq','unit','sex','age','geo','time'],size:[1,1,3,ages.length,1,times.length],dimension:{freq:{category:{index:{A:0}}},unit:{category:{index:{NR:0}}},
  sex:{category:{index:{T:0,M:1,F:2}}},age:{category:{index:idx(ages)}},geo:{category:{index:{[geo]:0}}},time:{category:{index:idx(times)}}},
 value,updated:'2026-09-25'};
}
function ineFixture(url){
 const match=url.match(/date=(\d{4})0101/),year=Number(match?.[1]||2025),arr=[];
 let total=0;
 for(let a=0;a<=99;a++){for(const [sex,value] of [['Hombres',1000+a],['Mujeres',1200+a]]){arr.push({Nombre:'Total Nacional. '+a+' años. '+sex+'. Población. Número. ',Data:[{Anyo:year,Valor:value}]});total+=value;}}
 for(const [sex,value] of [['Hombres',10000],['Mujeres',12000]]){arr.push({Nombre:sex+'. 100 y más años. Total Nacional. Población. Número. ',Data:[{Anyo:year,Valor:value}]});total+=value;}
 arr.push({Nombre:'Total Nacional. Todas las edades. Total. Población. Número. ',Data:[{Anyo:year,Valor:total}]});
 return arr;
}

test('tipologías docentes, dos pirámides reales y comparación',async({page})=>{
 await page.route('**/servicios.ine.es/wstempus/js/es/DATOS_TABLA/**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(ineFixture(route.request().url()))}));
 await page.route('**/ec.europa.eu/eurostat/api/**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(eurostatFixture(route.request().url()))}));
 await page.goto('/');
 await expect(page.getByRole('heading',{name:'Tipos de pirámides poblacionales'})).toBeVisible();
 await expect(page.locator('.type-card')).toHaveCount(3);
 await page.locator('#formA button').click();await page.locator('#formB button').click();
 await expect(page.locator('#chartA svg')).toBeVisible();
 await expect(page.locator('#chartB svg')).toBeVisible();
 await expect(page.locator('#tableA tbody tr')).toHaveCount(18);
 await expect(page.locator('#analyze')).toBeEnabled();
 await page.locator('#analyze').click();await expect(page.locator('#results')).toContainText('Comparación de estructuras poblacionales');
 await page.locator('#view').selectOption('absolute');
 await expect(page.locator('#chartA')).toContainText('Efectivos');
 await page.locator('#swap').click();await expect(page.locator('#analyze')).toBeEnabled();
});
test('una fuente inaccesible produce un error y no inventa datos',async({page})=>{
 await page.route('**/ec.europa.eu/eurostat/api/**',route=>route.fulfill({status:503,body:'Unavailable'}));
 await page.goto('/');await page.locator('#formB button').click();
 await expect(page.locator('#statusB')).toContainText('No se han podido obtener datos válidos');
 await expect(page.locator('#chartB svg')).toHaveCount(0);await expect(page.locator('#analyze')).toBeDisabled();
});
test('accesibilidad automática de la página y estados',async({page})=>{
 await page.goto('/');
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
 expect(result.violations).toEqual([]);
});

test('Alemania 2009: carga directa Eurostat con grupos quinquenales oficiales',async({page})=>{
 await page.route('**/servicios.ine.es/wstempus/js/es/DATOS_TABLA/**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(ineFixture(route.request().url()))}));
 await page.route('**/ec.europa.eu/eurostat/api/**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(eurostatFixture(route.request().url()))}));
 await page.goto('/');
 await page.locator('#formA [name=provider]').selectOption('eurostat');
 await page.locator('#formA [name=place]').selectOption('DE');
 await page.locator('#formA [name=year]').selectOption('2009');
 await page.locator('#formA button').click();
 await expect(page.locator('#statusA')).toContainText('Datos oficiales cargados');
 await expect(page.locator('#tableA tbody tr')).toHaveCount(18);
 await expect(page.locator('#metaA')).toContainText('Alemania');
 await expect(page.locator('#metaA')).toContainText('2009');
});
test('cambio de país durante una consulta lenta no muestra resultados obsoletos',async({page})=>{
 await page.route('**/servicios.ine.es/wstempus/js/es/DATOS_TABLA/**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(ineFixture(route.request().url()))}));
 await page.route('**/ec.europa.eu/eurostat/api/**',async route=>{await new Promise(r=>setTimeout(r,300));try{await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(eurostatFixture(route.request().url()))});}catch{}});
 await page.goto('/');
 await page.locator('#formB [name=place]').selectOption('DE');
 await expect(page.locator('#chartB svg')).toHaveCount(0);
 await page.locator('#formB button').click();
 await expect(page.locator('#metaB')).toContainText('Alemania');
});


test('exportaciones de la comparación real incluyen procedencia y series completas',async({page})=>{
 await page.route('**/servicios.ine.es/wstempus/js/es/DATOS_TABLA/**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(ineFixture(route.request().url()))}));
 await page.route('**/ec.europa.eu/eurostat/api/**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(eurostatFixture(route.request().url()))}));
 await page.goto('/');
 await expect(page.locator('#statusA')).toContainText('Datos oficiales cargados');
 await expect(page.locator('#statusB')).toContainText('Datos oficiales cargados');
 await page.locator('#analyze').click();
 const first=page.waitForEvent('download');await page.locator('#export').click();const download=await first;
 expect(download.suggestedFilename()).toContain('comparacion-estructura-social.txt');
 const text=(await import('node:fs/promises')).readFile(await download.path(),'utf8'); 
 expect(await text).toContain('INE');expect(await text).toContain('Eurostat');
 const second=page.waitForEvent('download');await page.locator('#exportCSV').click();const csv=await second;
 const body=await (await import('node:fs/promises')).readFile(await csv.path(),'utf8');
 expect(body).toContain('Piramide;Fuente;Territorio;Año;Edad;Hombres;Mujeres');
 expect(body.split('\n').filter(row=>row.startsWith('A;')).length).toBe(18);
 expect(body.split('\n').filter(row=>row.startsWith('B;')).length).toBe(18);
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
 expect(axe.violations).toEqual([]);
});
test('el catálogo no ofrece años con cohortes oficialmente incompletas',async({page})=>{
 await page.route('**/servicios.ine.es/wstempus/js/es/DATOS_TABLA/**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(ineFixture(route.request().url()))}));
 await page.route('**/ec.europa.eu/eurostat/api/**',route=>{
  const json=eurostatFixture(route.request().url());
  if(!new URL(route.request().url()).searchParams.get('time')){
   const ages=20,n=3,yearIndex=json.dimension.time.category.index['2009'];
   delete json.value[(ages+17)*n+yearIndex]; // 80-84 años, hombres, 2009
  }
  return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(json)});
 });
 await page.goto('/');
 await expect(page.locator('#statusB')).toContainText('Datos oficiales cargados');
 await expect(page.locator('#formB [name=year] option[value="2009"]')).toHaveCount(0);
 await expect(page.locator('#formB [name=year] option[value="2025"]')).toHaveCount(1);
});
