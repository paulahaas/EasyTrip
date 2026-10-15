// Baixa a população mais recente de cada país (Banco Mundial, indicador
// SP.POP.TOTL, sem chave de API) e grava em apps/backend/src/countries/population.json.
// O backend lê esse arquivo offline; rode de novo para atualizar os números.
// Uso: node scripts/update-population.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'apps/backend/package.json'));
const worldCountries = require('world-countries');
const out = path.join(root, 'apps/backend/src/countries/population.json');

const url =
  'https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&mrnev=1&per_page=500';
const res = await fetch(url);
if (!res.ok) throw new Error(`Banco Mundial respondeu ${res.status}`);
const [, rows] = await res.json();

const byIso3 = new Map(
  rows
    .filter((r) => r.countryiso3code && typeof r.value === 'number')
    .map((r) => [r.countryiso3code, { value: r.value, year: Number(r.date) }]),
);

// Códigos que o Banco Mundial usa diferente do world-countries.
const WORLD_BANK_CODE = { UNK: 'XKX' }; // Kosovo

const population = {};
for (const c of worldCountries) {
  const entry = byIso3.get(WORLD_BANK_CODE[c.cca3] ?? c.cca3);
  if (entry) population[c.cca3] = entry;
}
const sorted = Object.fromEntries(Object.entries(population).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(out, JSON.stringify(sorted, null, 2) + '\n');

const missing = worldCountries.filter((c) => !population[c.cca3]).map((c) => c.name.common);
console.log(`População salva para ${Object.keys(sorted).length} de ${worldCountries.length} países em ${path.relative(root, out)}`);
console.log(`Sem dado do Banco Mundial (${missing.length}): ${missing.join(', ')}`);
