import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import xss from 'xss-clean';
import globalErrorHandler from './controllers/error';
import './cron';
import trimmer from './middleware/trimmer';
import authenticationRouter from './routers/authenticationRouter.js';
import dictionaryRouter from './routers/dictionaryRouter';
import miscellaneousRouter from './routers/miscellaneousRouter';
import transactionRouter from './routers/transactionRouter.js';
import userRouter from './routers/userRouter.js';
import { AppError } from './utils/appError.js';
import { __dirname } from './utils/common.js';

const app = express();

// Set security HTTP headers
app.use(helmet());

// Cors
app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_URL],
  })
);

// Logging
app.use(morgan(process.env.ENVIRONMENT === 'development' ? 'combined' : 'tiny'));

// Limit requests from the same API
app.use(
  '/api',
  rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
  })
);

// Body parser, reading body into req.body
app.use(express.json({ limit: '10kb' }));

app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution (multiple params with the same name)
app.use(hpp());

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use(trimmer(['body', 'params', 'query']));

app.use('/api/v1', authenticationRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/transaction', transactionRouter);
app.use('/api/v1/dictionary', dictionaryRouter);
app.use('/api/v1/miscellaneous', miscellaneousRouter);

app.all('*', (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

export default app;
