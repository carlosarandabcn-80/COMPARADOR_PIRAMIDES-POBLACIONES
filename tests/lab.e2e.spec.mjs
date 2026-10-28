import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {synthetic,toCSV} from '../lab/core.mjs';

test('exploración y comparación de pirámides, tablas, indicadores y razonamiento',async({page})=>{
  await page.goto('/');
  await expect(page.getByRole('heading',{name:/Los datos describen/})).toBeVisible();
  await expect(page.locator('#chartMain svg')).toBeVisible();
  await expect(page.locator('#tableMain tbody tr')).toHaveCount(18);
  await expect(page.locator('#metrics .metric')).toHaveCount(9);
  await expect(page.locator('#reasoning .reason-card')).toHaveCount(4);
  await page.locator('#scale').selectOption('absolute');
  await expect(page.locator('#chartMain svg')).toContainText('Efectivos');
  await page.locator('#focus').selectOption('old');
  await expect(page.locator('#chartMain .dimmed').first()).toHaveCount(1);
  await page.locator('#swap').click();
  await expect(page.locator('#primaryDataset')).toHaveValue('envejecida');
  await expect(page.locator('#reportPreview')).toContainText('MODELO SINTÉTICO');
});
test('casos formativos con retroalimentación y guardado local',async({page})=>{
  await page.goto('/');
  await page.locator('#caseSelector').selectOption('C6');
  await page.getByRole('button',{name:'Sí, está demostrado'}).click();
  await expect(page.locator('#casePanel [role=status]')).toContainText('Correcto');
  await page.locator('#need').fill('Comprobar barreras de acceso mediante entrevistas con participación voluntaria.');
  await page.locator('#saveProposal').click();
  await expect(page.locator('#saveStatus')).toContainText('Guardado');
  await page.reload();
  await expect(page.locator('#need')).toHaveValue(/Comprobar barreras/);
});
test('CSV importado es etiquetado y se bloquean comparaciones sintético/observado',async({page})=>{
  await page.goto('/');
  const csv=toCSV(synthetic('joven'));
  await page.locator('#upload').setInputFiles({name:'datos.csv',mimeType:'text/csv',buffer:Buffer.from(csv)});
  await expect(page.locator('#uploadStatus')).toContainText('Importación local correcta');
  await expect(page.locator('#metaMain')).toContainText('DATOS APORTADOS');
  await expect(page.locator('#comparison')).toContainText('COMPARACIÓN BLOQUEADA');
});
test('lectura sin ratón y auditoría automática WCAG 2.2 A/AA',async({page})=>{
  await page.goto('/');
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
  expect(axe.violations).toEqual([]);
});
