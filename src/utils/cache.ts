import NodeCache from 'node-cache';

export enum CacheKeyPrefix {
  ExchangeRates = 'ExchangeRates',
}

// Set the individual timeout for each key to 12h, after which they are deleted
const cache = new NodeCache({ stdTTL: 3600 * 12 });
export default cache;
