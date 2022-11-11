import axios from 'axios';
import { AppError } from '../utils/appError';
import cache, { CacheKeyPrefix } from '../utils/cache';

const yyyy_mm_dd = (date: Date) => {
  var mm = date.getMonth() + 1;
  var dd = date.getDate();

  return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
};

interface ExchangeRatesResponse {
  success: boolean;
  base: string;
  date: Date;
  rates: Record<string, number>;
}

const getExchangeRates = async (date: Date, base: string) => {
  const exchangeRates = cache.get<Record<string, number>>(`${CacheKeyPrefix.ExchangeRates}_${base}_${date.toString()}`);
  if (exchangeRates) return exchangeRates;

  const response = await axios.get<ExchangeRatesResponse>(
    `${process.env.CURRENCY_API_URL}/${yyyy_mm_dd(date)}?base=${base}&symbols=RON,EUR,USD`
  );
  if (!response.data || !response.data.success) throw new AppError('Could not retrieve currency exchange rates!', response.status);

  cache.set(`${CacheKeyPrefix.ExchangeRates}_${base}_${date.toString()}`, response.data.rates);
  return response.data.rates;
};

const getConvertedValue = async (date: Date, value: number, from: string, to: string) => {
  // get the exchange rate at the beginning of the month => so an approximation
  const exchangeRates = await getExchangeRates(new Date(date.getFullYear(), date.getMonth(), 1), from);
  return exchangeRates[to] * value;
};

export default { getExchangeRates, getConvertedValue };
