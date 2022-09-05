import mongoose from 'mongoose';
import { Currency } from '../constants.js';
import Spending from '../entities/spending.js';

const spendingSchema = new mongoose.Schema<Spending>({
  amount: {
    type: Number,
    required: [true, 'Spending amount needs to be specified'],
    min: [0, 'Amount needs to be greater than 0'],
    max: [Number.MAX_SAFE_INTEGER, 'Big if true'],
  },
  date: {
    type: Date,
    required: [true, 'Spending date needs to be specified'],
  },
  currency: {
    type: String,
    enum: [Currency.RON, Currency.EUR, Currency.USD],
    required: [true, 'Spending currency needs to be specified'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Spending user must be specified'],
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Spending category must be specified'],
  },
});

const SpendingModel = mongoose.model<Spending>('Spending', spendingSchema);

export default SpendingModel;
