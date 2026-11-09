const panel = document.querySelector('#accessibility');
const root = document.documentElement;
const textSize = panel.querySelector('#text-size');
const toggles = [
  ['contrast', panel.querySelector('#high-contrast')],
  ['spacing', panel.querySelector('#spaced-text')],
  ['tables', panel.querySelector('#prefer-tables')]
];
const key = 'piramides-preferencias-accesibilidad';
const openedForTables = new Set();

let saved = {};
try {
  saved = JSON.parse(localStorage.getItem(key)) ?? {};
} catch {
  // Los controles también funcionan con el almacenamiento desactivado.
}

function openDataTables() {
  for (const table of document.querySelectorAll('details[data-data-table]')) {
    if (!table.open) {
      table.open = true;
      openedForTables.add(table);
    }
  }
}

function applyPreferences(persist = true) {
  root.style.setProperty('--text-scale', textSize.value + '%');
  for (const [name, control] of toggles) root.toggleAttribute('data-' + name, control.checked);

  if (root.hasAttribute('data-tables')) {
    openDataTables();
  } else {
    for (const table of openedForTables) table.open = false;
    openedForTables.clear();
  }

  if (!persist) return;
  const preferences = {size: textSize.value};
  for (const [name, control] of toggles) preferences[name] = control.checked;
  try {
    localStorage.setItem(key, JSON.stringify(preferences));
  } catch {
    // Las preferencias siguen activas durante la sesión de esta página.
  }
}

if ([...textSize.options].some(option => option.value === saved.size)) textSize.value = saved.size;
for (const [name, control] of toggles) control.checked = saved[name] === true;
applyPreferences(false);

panel.addEventListener('change', () => applyPreferences());
document.querySelector('#comparison-accessibility').addEventListener('click', event => {
  event.preventDefault();
  panel.open = true;
  panel.querySelector('summary').focus();
});
panel.querySelector('#reset-accessibility').addEventListener('click', () => {
  textSize.value = '100';
  for (const [, control] of toggles) control.checked = false;
  applyPreferences();
});

new MutationObserver(() => {
  for (const table of openedForTables) {
    if (!table.isConnected) openedForTables.delete(table);
  }
  if (root.hasAttribute('data-tables')) openDataTables();
}).observe(document.querySelector('#results'), {childList: true});
