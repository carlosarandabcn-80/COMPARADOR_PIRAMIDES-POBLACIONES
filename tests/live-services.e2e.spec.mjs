import {test,expect} from '@playwright/test';
test.skip(!process.env.RUN_LIVE_EXTERNAL,'Prueba real de red: solo se ejecuta bajo demanda en flujo independiente.');
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
});