/* Smoke real de navegador. Requiere servidor local y Playwright instalado. */
const {chromium}=require("playwright"),assert=require("node:assert/strict"),path=require("node:path");
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1365,height:900},acceptDownloads:true});
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 try{
  const response=await page.goto("http://127.0.0.1:8765/",{waitUntil:"domcontentloaded"});
  assert.equal(response.status(),200);
  await page.locator("#metricsBody tr").first().waitFor();
  assert.equal(await page.locator("#chartA .pyramid-row").count(),18);
  assert.equal(await page.locator("#chartB .pyramid-row").count(),18);
  assert.equal(await page.locator("#metricsBody tr").count(),11);
  assert.equal(await page.locator("#datasetA option").count(),3);
  assert.match(await page.locator("#metaA").innerText(),/FICTICIOS/i);
  const nameBefore=await page.locator("#labelA").innerText();
  await page.locator("#swap").click();
  assert.notEqual(await page.locator("#labelA").innerText(),nameBefore);
  assert.match(await page.locator("#contrast").innerText(),/puntos porcentuales/);
  await page.locator("#caseSelect").selectOption("5");
  assert.match(await page.locator("#caseText").innerText(),/diagnóstico territorial participativo/i);
  await page.locator("#step1").fill("Diferencia medida en puntos porcentuales.");
  await page.locator("#saveProgress").click();
  await page.reload({waitUntil:"domcontentloaded"});
  assert.match(await page.locator("#step1").inputValue(),/Diferencia medida/);
  await page.locator("#importButton").click();
  assert.match(await page.locator("#importStatus").innerText(),/Selecciona un archivo/);
  await page.locator("#importFile").setInputFiles(path.resolve(__dirname,"../examples/datos-sinteticos.csv"));
  await page.locator("#importTerritory").fill("Simulación importada");
  await page.locator("#importPeriod").fill("Ejemplo ficticio");
  await page.locator("#importSource").fill("Datos sintéticos de este repositorio");
  await page.locator("#importButton").click();
  await page.waitForFunction(()=>document.getElementById("importStatus").textContent.trim().length>0);
  assert.match(await page.locator("#importStatus").innerText(),/Importación validada estructuralmente/);
  assert.equal(await page.locator("#datasetA option").count(),4);
  assert.match(await page.locator("#metaA").innerText(),/NO VERIFICADA/);
  assert.match(await page.locator("#reportText").innerText(),/DATOS DETALLADOS PARA REPRODUCIR/);
  const downloadPromise=page.waitForEvent("download");await page.locator("#downloadReport").click();
  const download=await downloadPromise;assert.match(download.suggestedFilename(),/informe-demografia.*\.txt/);
  await page.locator("#clearProgress").click();assert.equal(await page.locator("#step1").inputValue(),"");
  await page.goto("http://127.0.0.1:8765/comparador-original.html",{waitUntil:"domcontentloaded"});
  await page.locator("#modelSelect").waitFor({timeout:15000});
  assert.ok((await page.locator("#modelSelect option").count())>=3);
  assert.equal(errors.length,0,"Errores JS: "+errors.join("; "));
  console.log("E2E OK: carga, cálculos, comparación, casos, persistencia, importación, exportación y compatibilidad original.");
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
