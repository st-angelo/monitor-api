import { Currency } from '@prisma/client';

class CurrencyDto {
  id: number;
  code: string;
  name: string;

  constructor(currency: Currency) {
    this.id = currency.id;
    this.code = currency.code;
    this.name = currency.name;
  }
}

export default CurrencyDto;
