import axios from 'axios';
import { AppError } from '../utils/appError';
import cache, { CacheKeyPrefix } from '../utils/cache';

interface ExchangeRatesResponse {
  success: boolean;
  base: string;
  date: Date;
  rates: Record<string, number>;
}

const getExchangeRates = async (base: string) => {
  const exchangeRates = cache.get<Record<string, number>>(`${CacheKeyPrefix.ExchangeRates}_${base}`);
  if (exchangeRates) return exchangeRates;

  const response = await axios.get<ExchangeRatesResponse>(`${process.env.CURRENCY_API_URL}/latest?base=${base}`);
  if (!response.data || !response.data.success) throw new AppError('Could not retrieve currency exchange rates!', response.status);

  cache.set(`${CacheKeyPrefix.ExchangeRates}_${base}`, response.data.rates);
  return response.data.rates;
};

const getConvertedValue = async (value: number, from: string, to: string) => {
  const exchangeRates = await getExchangeRates(from);
  return exchangeRates[to] * value;
};

export default { getExchangeRates, getConvertedValue };
