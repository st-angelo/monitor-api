import { Currency } from '@prisma/client';

class CurrencyDto {
  id: string;
  code: string;

  constructor(currency: Currency) {
    this.id = currency.id;
    this.code = currency.code;
  }
}

export default CurrencyDto;
