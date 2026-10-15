import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@easytrip.test';
  const passwordHash = await bcrypt.hash('demo1234', 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash },
  });

  await prisma.searchHistory.deleteMany({ where: { userId: user.id } });
  await prisma.searchHistory.createMany({
    data: [
      { userId: user.id, query: 'France', countryName: 'France', cca2: 'FR' },
      { userId: user.id, query: 'Spain', countryName: 'Spain', cca2: 'ES' },
    ],
  });

  await prisma.wishlist.upsert({
    where: { userId_cca2: { userId: user.id, cca2: 'IT' } },
    update: {},
    create: {
      userId: user.id,
      cca2: 'IT',
      countryName: 'Italy',
      continent: 'Europe',
    },
  });

  console.log(`seeded demo user: ${email} / demo1234`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
