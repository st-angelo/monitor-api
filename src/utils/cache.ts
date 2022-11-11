import NodeCache from 'node-cache';

export enum CacheKeyPrefix {
  ExchangeRates = 'ExchangeRates',
}

// Set the individual timeout for each key to infinite
const cache = new NodeCache({ stdTTL: 0 });
export default cache;
