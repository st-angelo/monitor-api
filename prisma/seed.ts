import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Currency
  const _currencies = [{ code: 'RON', implicit: true }, { code: 'EUR' }, { code: 'USD' }];
  await prisma.currency.deleteMany();
  await prisma.currency.createMany({
    data: _currencies,
  });

  // TransactionType and Category
  const _spendingCategories = [
    {
      code: 'Grocery',
      description: 'Outflux of money related to groceries',
      color: '#ffff00',
    },
    {
      code: 'Transport',
      description: 'Outflux of money related to transport',
      color: '#348feb',
    },
    {
      code: 'Houseware',
      description: 'Outflux of money related to houseware',
      color: '#753017',
    },
    {
      code: 'Health',
      description: 'Outflux of money related to health',
      color: '#83d12a',
    },
    {
      code: 'Rent',
      description: 'Outflux of money related to rent',
      color: '#7b2fed',
    },
    {
      code: 'Utility',
      description: 'Outflux of money related to utilities',
      color: '#2f32ed',
    },
    {
      code: 'Subscription',
      description: 'Outflux of money related to subscriptions',
      color: '#27dbcc',
    },
    {
      code: 'Entertainment',
      description: 'Outflux of money related to entertainment',
      color: '#db2727',
    },
    {
      code: 'Investment',
      description: 'Outflux of money related to investments',
      color: '#18a314',
    },
  ];

  const _earningCategories = [
    {
      code: 'Salary',
      description: 'Influx of money from your job',
      color: '#348feb',
    },
    {
      code: 'Investment',
      description: 'Influx of money related to investments',
      color: '#18a314',
    },
  ];

  await prisma.category.deleteMany();
  await prisma.transactionType.deleteMany();

  await prisma.transactionType.create({
    data: {
      code: 'Spending',
      implicit: true,
      Category: { createMany: { data: _spendingCategories } },
    },
  });
  await prisma.transactionType.create({
    data: {
      code: 'Earning',
      Category: { createMany: { data: _earningCategories } },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
