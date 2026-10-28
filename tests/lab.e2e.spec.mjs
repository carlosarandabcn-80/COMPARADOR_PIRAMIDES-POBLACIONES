import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
function eurostatFixture(url){
 const p=new URL(url).searchParams,geo=p.get('geo'),year=p.get('time');
 const ages=['TOTAL','Y_LT1',...Array.from({length:99},(_,i)=>'Y'+(i+1)),'Y_OPEN','UNK'];
 const idx=a=>Object.fromEntries(a.map((v,i)=>[v,i]));
 const value={};let totalM=0,totalF=0;
 ages.forEach((age,i)=>{if(['TOTAL','UNK'].includes(age))return;const m=age==='Y_OPEN'?30:1000+i*2,f=age==='Y_OPEN'?42:1100+i*2;value[2*i]=m;value[2*i+1]=f;totalM+=m;totalF+=f;});
 value[0]=totalM;value[1]=totalF;
 return {id:['age','sex','geo','time','unit','freq'],size:[ages.length,2,1,1,1,1],dimension:{age:{category:{index:idx(ages)}},sex:{category:{index:{M:0,F:1}}},geo:{category:{index:{[geo]:0}}},time:{category:{index:{[year]:0}}},unit:{category:{index:{NR:0}}},freq:{category:{index:{A:0}}}},value,updated:'2026-10-28'};
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
