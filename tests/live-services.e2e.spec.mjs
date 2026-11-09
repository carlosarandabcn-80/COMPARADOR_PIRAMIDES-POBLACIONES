import {test,expect} from '@playwright/test';
test.skip(!process.env.RUN_LIVE_EXTERNAL,'Prueba real de red: solo se ejecuta bajo demanda en flujo independiente.');
test.describe.configure({timeout:120000});
test('conexión real del navegador a Eurostat (Alemania 2009) y al INE (2001)',async({page})=>{
 await page.goto('/');
 await page.locator('#formA [name=provider]').selectOption('eurostat');
 await page.locator('#formA [name=place]').selectOption('DE');
 await page.locator('#formA [name=year]').selectOption('2009');
 await page.locator('#formA button[type=submit]').click();
 await expect(page.locator('#statusA')).toContainText('Datos oficiales cargados',{timeout:60000});
 await expect(page.locator('#metaA')).toContainText('Alemania');
 await expect(page.locator('#tableA tbody tr')).toHaveCount(18);
 await page.locator('#formB [name=provider]').selectOption('ine');
 await page.locator('#formB [name=year]').selectOption('2001');
 await page.locator('#formB button[type=submit]').click();
 await expect(page.locator('#statusB')).toContainText('Datos oficiales cargados',{timeout:90000});
 await expect(page.locator('#tableB tbody tr')).toHaveCount(18);
 await page.locator('#analyze').click();
 await expect(page.locator('#results')).toContainText('Comparación de estructuras poblacionales');
 await page.locator('#formA [name=year]').selectOption('2023');
 await page.locator('#formA button[type=submit]').focus();
 await page.keyboard.press('Enter');
 await expect(page.locator('#comparison-context .comparison-warnings')).toContainText('ruptura de serie',{ignoreCase:true});
 await expect(page.locator('#formA button[type=submit]')).toBeFocused();
});

test('España 1974 y 1975 en el navegador con el grupo 85+ oficial del INE',async({page})=>{
 await page.goto('/#comparador');
 await page.locator('#formB [name=provider]').selectOption('ine');
 for(const [side,year] of [['A','1974'],['B','1975']]){
  await page.locator('#form'+side+' [name=year]').selectOption(year);
  await page.locator('#form'+side+' button').click();
 }
 await expect(page.locator('#statusA')).toContainText('Datos oficiales cargados',{timeout:90000});
 await expect(page.locator('#statusB')).toContainText('Datos oficiales cargados',{timeout:90000});
 await expect(page.locator('#tableA tbody tr')).toHaveCount(18);
 await expect(page.locator('#tableB tbody tr')).toHaveCount(18);
 await expect(page.locator('#tableA tbody tr').last().locator('td').last()).toContainText('199.335 personas');
 await expect(page.locator('#tableB tbody tr').last().locator('td').last()).toContainText('201.172 personas');
 await expect(page.locator('#comparison-context')).toContainText('1974 → 1975');
 await page.locator('#analyze').click();
 await expect(page.locator('#results')).toContainText('evolución entre 1974 y 1975');
 const youth=page.locator('.age-group-table tbody tr').first();
 await expect(youth).toContainText('+75.048 personas');
 await expect(youth).toContainText('-0,09 pp');
 await expect(page.locator('#contrast-chart .contrast-bar')).toHaveCount(36);
 await page.locator('#swap').click();
 await page.locator('#analyze').click();
 await expect(youth).toContainText('+75.048 personas');
 await expect(youth).toContainText('-0,09 pp');
});
