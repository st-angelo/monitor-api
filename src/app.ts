import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import xss from 'xss-clean';
import authenticationRouter from './routers/authenticationRouter.js';
import spendingRouter from './routers/spendingRouter.js';
import userRouter from './routers/userRouter.js';
import { __dirname } from './utils/common.js';

const app = express();

// Set security HTTP headers
app.use(helmet());

// Cors
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Logging
//app.use(morgan('combined'));

// Limit requests from the same API
app.use(
  '/api',
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
  })
);

// Body parser, reading body into req.body
app.use(express.json({ limit: '10kb' }));

app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution (multiple params with the same name)
app.use(hpp());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test
app.use((req, res, next) => {
  next();
});

app.use('/api/v1', authenticationRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/spending', spendingRouter);

export default app;
