import { TransactionType } from '@prisma/client';

class TransactionTypeDto {
  id: string;
  code: string;

  constructor(transactionType: TransactionType) {
    this.id = transactionType.id;
    this.code = transactionType.code;
  }
}

export default TransactionTypeDto;
