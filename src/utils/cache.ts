import NodeCache from 'node-cache';

export enum CacheKeyPrefix {
  ExchangeRates = 'ExchangeRates',
  TransactionTypes = 'TransactionTypes',
  UserCategories = 'UserCategories',
  Currencies = 'Currencies',
}

// Set the individual timeout for each key to infinite
const cache = new NodeCache({ stdTTL: 0 });
export default cache;
