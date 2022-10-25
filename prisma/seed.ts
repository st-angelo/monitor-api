import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Currency
  const _currencies = [{ code: 'RON', implicit: true }, { code: 'EUR' }, { code: 'USD' }];
  await prisma.currency.deleteMany();
  await prisma.currency.createMany({
    data: _currencies,
  });

  // TransactionType
  await prisma.transactionType.deleteMany();
  const _transactionType_Spending = await prisma.transactionType.create({
    data: {
      code: 'Spending',
    },
  });
  const _transactionType_Earning = await prisma.transactionType.create({
    data: {
      code: 'Earning',
    },
  });

  // Categories
  const _categories = [
    {
      code: 'Grocery',
      description: 'Outflux of money related to groceries',
      color: '#fff',
      transactionTypeId: _transactionType_Spending.id,
    },
    {
      code: 'Transport',
      description: 'Outflux of money related to transport',
      color: '#fff',
      transactionTypeId: _transactionType_Spending.id,
    },
    {
      code: 'Houseware',
      description: 'Outflux of money related to houseware',
      color: '#fff',
      transactionTypeId: _transactionType_Spending.id,
    },
    {
      code: 'Health',
      description: 'Outflux of money related to health',
      color: '#fff',
      transactionTypeId: _transactionType_Spending.id,
    },
    {
      code: 'Rent',
      description: 'Outflux of money related to rent',
      color: '#fff',
      transactionTypeId: _transactionType_Spending.id,
    },
    {
      code: 'Utility',
      description: 'Outflux of money related to utilities',
      color: '#fff',
      transactionTypeId: _transactionType_Spending.id,
    },
    {
      code: 'Subscription',
      description: 'Outflux of money related to subscriptions',
      color: '#fff',
      transactionTypeId: _transactionType_Spending.id,
    },
    {
      code: 'Entertainment',
      description: 'Outflux of money related to entertainment',
      color: '#fff',
      transactionTypeId: _transactionType_Spending.id,
    },
    {
      code: 'Investment',
      description: 'Outflux of money related to investments',
      color: '#fff',
      transactionTypeId: _transactionType_Spending.id,
    },
    {
      code: 'Salary',
      description: 'Influx of money from your job',
      color: '#fff',
      transactionTypeId: _transactionType_Earning.id,
    },
    {
      code: 'Investment',
      description: 'Influx of money related to investments',
      color: '#fff',
      transactionTypeId: _transactionType_Earning.id,
    },
  ];
  await prisma.category.deleteMany();
  await prisma.category.createMany({
    data: _categories,
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
