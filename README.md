# Laboratorio de demografía aplicada a la Educación Social

**Prototipo experimental de innovación educativa — 26/10/2026.** Conecta visualización estadística, hipótesis prudentes, diagnóstico territorial participativo y diseño condicionado de actuaciones socioeducativas. No es una herramienta científica validada ni está avalada por una universidad.

## Acceder y conservar lo anterior

- **`index.html`**: portada y laboratorio en GitHub Pages.
- **`laboratorio.html`**: acceso directo al laboratorio.
- **`comparador-original.html`**: copia legible íntegra del comparador anterior (funcionalidades, comentarios, pirámides y accesibilidad original).
- **`payload/index.html.gz.b64`**: paquete original conservado para trazabilidad, **no se ha borrado**.

El laboratorio nuevo contiene tres perfiles **sintéticos, ficticios** denominados Territorio A/B/C. No son datos de España, México, África ni otros lugares reales. No debe extraerse de ellos diagnóstico social. Los datos externos se importan desde CSV/JSON y se validan **solo estructuralmente**, nunca en su procedencia.

## Funciones del prototipo

1. Dos pirámides comparables en la misma escala porcentual, con tablas accesibles y selección intercambiable.
2. Once recuentos o indicadores derivados del mismo motor estadístico, con fórmulas y tratamiento de denominadores cero.
3. Importación local CSV/JSON, 18 tramos × dos sexos, metadatos de periodo y procedencia obligatorios.
4. Observación descriptiva reproducible y siete pasos de razonamiento socioeducativo redactados por el estudiante.
5. Seis situaciones educativas con preguntas, errores de interpretación y criterios de revisión.
6. Guardado local *optativo* de respuestas y borrador de informe exportable TXT o mediante impresión/PDF.
7. Documentación de límites, protocolo de investigación propuesto, guía docente, memoria académica y dosier de valoración.

**Decisión científica clave:** se calcula dependencia con **0–14/15–64/65+** (intervalos quinquenales). Los indicadores oficiales de dependencia y envejecimiento del INE usan **menores de 16/16–64/65+**. Nunca se deben confundir las definiciones. Véase [metodología](docs/metodologia_laboratorio.md).

## Requisitos y ejecución

No se necesita backend. Se puede servir localmente mediante un servidor HTTP o desplegar en GitHub Pages. Evitar abrir los ficheros con `file://` si el navegador impone restricciones adicionales a recursos.

Para ejecutar tests:

```sh
node --version  # Node.js 20 o superior
npm test
```

Se dispone de una suite de 12 pruebas con `node:test` y de un workflow CI. Las pruebas Node y de navegador Chromium, con flujos de importación/exportación, se han ejecutado satisfactoriamente en [GitHub Actions](https://github.com/carlosarandabcn-80/COMPARADOR_PIRAMIDES-POBLACIONES/actions/runs/40318192555). Un análisis axe-core de la vista inicial no informó violaciones automáticas en los criterios configurados. Permanecen pendientes las pruebas manuales de accesibilidad, navegadores adicionales y auditoría completa; estos resultados no demuestran conformidad WCAG.

## Estructura esencial

```text
index.html
laboratorio.html
comparador-original.html
assets/demografia-core.js
assets/laboratorio.js
assets/laboratorio.css
examples/datos-sinteticos.csv
tests/demografia.test.cjs
.github/workflows/validacion.yml
docs/
```

## Documentación académica (borradores)

- [Auditoría inicial](docs/auditoria_inicial.md) y [estado de validación](docs/estado_validacion.md).
- [Metodología](docs/metodologia_laboratorio.md) y [diccionario/importación](docs/diccionario_datos.md).
- [Guía docente](docs/guia_docente.md) y [protocolo de investigación](docs/protocolo_investigacion.md).
- [Memoria universitaria preliminar](docs/memoria_academica.md).
- [Dosier institucional](docs/dosier_institucional.md).
- [Consultoría crítica final](docs/consultoria_final.md).

## Limitaciones abiertas

Los datos ficticios no proceden de fuentes oficiales. Un fichero importado conserva la procedencia **declarada por el usuario**, pero esta no se comprueba automáticamente. El programa no admite series con tramos distintos ni verifica armonización territorial y temporal. No recoge datos de uso ni transmite archivos al servidor de forma intencionada. Las respuestas solo persisten al activar guardado local. No se han realizado estudios con estudiantes, validación de contenido, pentest ni auditoría de accesibilidad completa.

**Licencias:** pendiente de decidir explícitamente licencias de código y documentación; no se presume que el repositorio tenga una licencia abierta por estar publicado.

© Autoría del proyecto. Su inclusión en procesos universitarios deberá acordarse con el profesorado y la institución correspondiente.
