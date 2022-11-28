import { format, startOfDay, subMonths, subWeeks, subYears } from 'date-fns';
import cron from 'node-cron';
import prisma from './data/prisma';

// Run this job every 3 hours
cron.schedule(
  '0 */6 * * *',
  async () => {
    console.info(`[CRON] at ${format(new Date(), 'MM-dd-HH-mm-ss')}: Continuing recurrent transactions...`);
    const now = Date.now();
    const recurrenceDates = [
      startOfDay(subWeeks(now, 1)),
      startOfDay(subMonths(now, 1)),
      startOfDay(subMonths(now, 3)),
      startOfDay(subYears(now, 1)),
    ];
    const recurrentTransactions = await prisma.transaction.findMany({
      where: { AND: [{ NOT: [{ recurrence: null }, { wasContinued: true }] }, { date: { in: recurrenceDates } }] },
    });

    const transactions = recurrentTransactions.map(({ id, date, added, wasContinued, ...rest }) => ({
      ...rest,
      date: new Date(now),
      added: new Date(now),
    }));

    await prisma.$transaction([
      prisma.transaction.createMany({ data: transactions }),
      prisma.transaction.updateMany({ data: { wasContinued: true }, where: { id: { in: recurrentTransactions.map(({ id }) => id) } } }),
    ]);
    console.info(`[CRON] at ${format(new Date(), 'MM-dd-HH-mm-ss')}: Successful!`);
  },
  { timezone: 'UTC' }
);
