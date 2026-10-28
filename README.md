# Laboratorio de demografía aplicada a la Educación Social

**Proyecto académico independiente, abierto y experimental.** El objetivo es conectar lectura crítica de datos demográficos, investigación territorial y diseño participativo de intervenciones socioeducativas. No se presenta como recurso validado científicamente ni aprobado por una universidad.

## Acceso y estructura
- **Inicio (`index.html`)**: laboratorio actualizado.
- **Comparador clásico (`clasico.html`)**: aplicación original conservada sin modificación de su paquete comprimido.
- **`lab/core.mjs`**: fórmulas, validación, importación, JSON-stat, casos y motor de reglas trazables.
- **`lab/main.mjs`**, **`lab/style.css`**: interfaz accesible con pirámides SVG, tablas, comparaciones, fichas e informes.
- **`tests/`**: pruebas unitarias Node y E2E Chromium/axe.
- **`docs/`**: diagnóstico, guía docente, protocolo piloto, memoria académica y dosier institucional.
- **`sw.js`**: disponibilidad sin conexión de recursos principales tras visita en línea.

## Funcionalidades implementadas
- Cuatro modelos **sintéticos** con poblaciones ficticias de 18 cohortes (0–4, …, 85+), para aprender a leer pirámides.
- Lectura absoluta/relativa, grupos de edad resaltados, tablas accesibles, nueve indicadores y fórmulas.
- Comparación de estructuras; se bloquean diferencias numéricas entre un modelo sintético y datos observados.
- Consulta opcional en línea de Eurostat (demo_pjan, datos anuales nacionales por edad y sexo) con **validación estricta**: no se imputan años o edades ausentes; si falla la consulta se comunica el error.
- Importación local CSV (cabecera `edad,hombres,mujeres` y 18 filas consecutivas) y JSON del laboratorio.
- Cuatro reglas interpretativas documentadas, seis ejercicios autoevaluables y ficha socioeducativa editable.
- Exportación CSV/JSON, informe de texto e impresión desde navegador.

## Qué no demuestra
Los modelos de prueba no son cifras oficiales. Los archivos importados no quedan certificados. Un indicador de envejecimiento **no** acredita dependencia funcional, pobreza, exclusión ni necesidad de una intervención específica. El valor educativo aún requiere una evaluación con estudiantes; la accesibilidad de WCAG 2.2 AA necesita revisión manual además de las pruebas automáticas. El módulo oficial de Eurostat está sujeto a conectividad, notas de calidad y revisión del endpoint.

## Ejecutar localmente
Requiere un servidor HTTP estático (los módulos ES no deben cargarse desde `file://`).
```bash
python3 -m http.server 4173
# Abrir http://localhost:4173
```
No se necesita backend, base de datos ni dependencias de producción. Las consultas oficiales requieren conexión a internet.

## Verificación técnica
```bash
node --test tests/core.test.mjs
node --check lab/core.mjs
node --check lab/main.mjs
# Opcional: npm install --no-save @playwright/test @axe-core/playwright
# npx playwright install chromium
# npx playwright test
```
Se automatizan comprobaciones en GitHub Actions. Un resultado verde **no** equivale a certificación de seguridad, conformidad WCAG o validación científica.

## Reproducción y fuentes
Referencia oficial: Eurostat, Population on 1 January by age and sex, `demo_pjan` (https://ec.europa.eu/eurostat/databrowser/view/demo_pjan/default/table?lang=en). Otras fuentes abiertas para desarrollos posteriores: INE (https://www.ine.es/datosabiertos/) e Idescat (https://www.idescat.cat/dades/obertes/). Los datos sintéticos quedan etiquetados en interfaz e informes.

## Ética
Para investigación con personas, obtener las autorizaciones correspondientes y consentimiento informado. La aplicación no debe recibir información personal sobre participantes o personas usuarias de servicios. La ficha se guarda en `localStorage` del navegador, no en el servidor de la aplicación. La consulta explícita a Eurostat envía la petición correspondiente al servicio externo.

Consultar la revisión de 2026 del Código Deontológico de la Educación Social desde el CGCEES: https://www.consejoeducacionsocial.net/quienes-somos/presentacion/

## Licencias
El nuevo código fuente (`lab/`) y la infraestructura de pruebas se ponen a disposición bajo licencia MIT (véase `LICENSE`), sin extender la licencia automáticamente al comparador antiguo o al material de terceros. Revisar derechos de los datos oficiales y atribuciones antes de redistribuir archivos.

Desarrollo académico: Aranda Tools, 2026.
