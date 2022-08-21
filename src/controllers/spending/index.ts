import { catchAsync } from '../../utils/catchAsync';
import { mockPromise } from '../../utils/functions';
import { TypedRequest as Request } from '../common.js';
import { SpendingsBody } from './metadata';

export const spendings = catchAsync(
  async (req: Request<SpendingsBody>, res, next) => {
    // TODO
    await mockPromise();

    res.status(200).json({
      status: 'success',
      data: ['ceva', 'altceva'],
    });
  }
);
