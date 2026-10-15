// Sobe um PostgreSQL portátil (sem Docker e sem instalar nada) para desenvolvimento.
// Os dados ficam em .postgres-data/ na raiz do projeto (ou na pasta de PGDATA)
// e persistem entre execuções.
// Uso: npm run db:local   (Ctrl+C para parar)
import EmbeddedPostgres from 'embedded-postgres';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.resolve(process.env.PGDATA ?? path.join(root, '.postgres-data'));
const port = Number(process.env.PGPORT ?? 5432);
const user = 'easytrip';
const password = 'easytrip';
const database = 'easytrip';

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user,
  password,
  port,
  persistent: true,
  onLog: () => {},
  onError: (err) => console.error(String(err).trim()),
});

const firstRun = !fs.existsSync(path.join(dataDir, 'PG_VERSION'));
if (firstRun) {
  console.log(`Criando o banco local em ${dataDir} ...`);
  await pg.initialise();
}

try {
  await pg.start();
} catch (err) {
  console.error(
    `\nNão foi possível iniciar o PostgreSQL na porta ${port}.` +
      '\nSe outro PostgreSQL já estiver usando essa porta, pare-o ou rode com outra porta:' +
      `\n  PGPORT=${port + 1} npm run db:local   (PowerShell: $env:PGPORT=${port + 1}; npm run db:local)` +
      `\nE ajuste a porta no DATABASE_URL do apps/backend/.env.\n`,
  );
  if (err) console.error(err);
  process.exit(1);
}

try {
  await pg.createDatabase(database);
} catch {
  // o banco já existe
}

console.log(`\nPostgreSQL rodando na porta ${port}. Use no apps/backend/.env:`);
console.log(`  DATABASE_URL=postgresql://${user}:${password}@localhost:${port}/${database}`);
if (firstRun) {
  console.log('\nPrimeira vez? Em outro terminal, crie as tabelas e o usuário demo:');
  console.log('  cd apps/backend && npx prisma migrate deploy && npx prisma db seed');
}
console.log('\nDeixe este terminal aberto. Ctrl+C para parar.\n');

let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  console.log('\nParando o PostgreSQL...');
  await pg.stop();
  process.exit(0);
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
setInterval(() => {}, 1 << 30);
