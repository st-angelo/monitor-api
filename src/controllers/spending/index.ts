import Spending from '../../data/entities/spending';
import SpendingModel from '../../data/models/spendingModel';
import factory from '../factory';
import { AddSpendingBody } from './metadata';

export const getSpendings = factory.getAll(SpendingModel);

export const getSpending = factory.getOne(SpendingModel);

export const addSpending = factory.createOne<Spending, AddSpendingBody>(SpendingModel);

export const updateSpending = factory.updateOne<Spending, AddSpendingBody>(SpendingModel);

export const deleteSpending = factory.deleteOne(SpendingModel);
