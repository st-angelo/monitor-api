import { endOfDay, format, startOfDay, subMonths, subWeeks, subYears } from 'date-fns';
import cron from 'node-cron';
import prisma from './data/prisma';

// Run this job every 3 hours
cron.schedule(
  '0 */6 * * *',
  // '*/10 * * * * *',
  async () => {
    console.info(`[CRON] at ${format(new Date(), 'MM-dd-HH-mm-ss')}: Continuing recurrent transactions...`);
    const now = Date.now();
    const recurrenceDates = [subWeeks(now, 1), subMonths(now, 1), subMonths(now, 3), subYears(now, 1)];

    const dateFilters = {
      OR: recurrenceDates.map(date => ({
        AND: [{ date: { gte: startOfDay(date) } }, { date: { lte: endOfDay(date) } }],
      })),
    };

    const recurrentTransactions = await prisma.transaction.findMany({
      where: {
        AND: [{ NOT: { recurrence: null } }, { OR: [{ propagated: null }, { propagated: false }] }, dateFilters],
      },
    });

    const transactions = recurrentTransactions.map(({ id, date, added, propagated, sourceId, ...rest }) => ({
      ...rest,
      date: new Date(now),
      added: new Date(now),
      sourceId: sourceId ?? id,
    }));

    await prisma.$transaction([
      prisma.transaction.createMany({ data: transactions }),
      prisma.transaction.updateMany({ data: { propagated: true }, where: { id: { in: recurrentTransactions.map(({ id }) => id) } } }),
    ]);
    console.info(`[CRON] at ${format(new Date(), 'MM-dd-HH-mm-ss')}: Successful!`);
  },
  { timezone: 'UTC' }
);
