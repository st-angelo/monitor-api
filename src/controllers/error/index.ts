import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/appError';

const sendErrorDev = (err: AppError, res: Response) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or other unknwn error: don't leak error details
  else {
    // 1. Log error
    console.error('An error has occured', err);

    // 2. Send generic message
    res.status(500).json({
      message: 'Something went wrong!',
    });
  }
};

const handleJWTInvalidError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again!', 401);

interface _Error {
  name?: string;
  code?: number;
  statusCode?: number;
  status?: string;
}

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err as _Error;
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.ENVIRONMENT === 'development') sendErrorDev(error as AppError, res);
  else if (process.env.ENVIRONMENT === 'production') {
    if (error.name === 'JsonWebTokenError') error = handleJWTInvalidError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error as AppError, res);
  }
};
