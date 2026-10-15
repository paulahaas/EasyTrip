import { execSync } from 'child_process';

export default function globalSetup() {
  const testUrl =
    process.env.DATABASE_URL_TEST ??
    'postgresql://easytrip:easytrip@localhost:5433/easytrip_test?schema=public';
  process.env.DATABASE_URL = testUrl;
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: testUrl },
  });
}
