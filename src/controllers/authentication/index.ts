import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { add, addSeconds } from 'date-fns';
import { NextFunction, Response } from 'express';
import prisma from '../../data/prisma.js';
import { sendResetPasswordEmail, sendWelcomeEmail } from '../../services/emailService.js';
import { AppError } from '../../utils/appError.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { verifyJWT } from '../../utils/jwtHelpers.js';
import { TypedRequest as Request } from '../common.js';
import { correctPassword, createAndSendToken, userChangedPasswordAfter, userNotFound } from './common.js';
import { ForgotPasswordBody, LoginBody, ResetPasswordBody, SignupBody } from './metadata.js';

export const signup = catchAsync(async (req: Request<SignupBody>, res, next) => {
  const { name, email, password } = req.body;

  const existing = await prisma.user.count({ where: { email } });
  if (existing > 0) return next(new AppError('A user with this email already exists', 409));

  const implicitCurrency = await prisma.currency.findFirst({ where: { implicit: true } });
  if (!implicitCurrency) return next(new AppError('An implicit currency is not configured', 409));

  // The verify token will be sent with the email to confirm identity
  const verifyToken = crypto.randomBytes(32).toString('hex');

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 12),
      verifyToken: crypto.createHash('sha256').update(verifyToken).digest('hex'),
      UserPreference: { create: { baseCurrencyId: implicitCurrency.id } },
    },
    include: {
      UserPreference: true,
    },
  });

  await sendWelcomeEmail(newUser, verifyToken, `${req.protocol}://${req.get('host')}`);

  createAndSendToken(newUser, 201, res);
});

export const signin = catchAsync(async (req: Request<LoginBody>, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password) return next(new AppError('Please provide email and password!', 400));

  // 2. Check if user exists && password is correct
  const user = await prisma.user.findFirst({ where: { email }, include: { UserPreference: true } });

  if (!user || !(await correctPassword(password, user.password))) return next(new AppError('Incorrect email or password!', 401));

  // 3. If everything is ok, send token to client
  createAndSendToken(user, 200, res);
});

export const signOut = (req: Request, res: Response, next: NextFunction) => {
  res.cookie('jwt', 'signed out', {
    expires: addSeconds(Date.now(), 5),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

export const protect = catchAsync(async (req: Request, res, next) => {
  // 1. Getting token and check if exists
  let token: string | null = null;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    [, token] = authorization.split(' ').map(x => x.trim());
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next(new AppError('You are not logged in! Please login to get access', 401));

  // 2. Verification token
  const decoded = await verifyJWT(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const user = await prisma.user.findUnique({ where: { id: String(decoded.id) }, include: { UserPreference: true } });
  if (!user) return next(new AppError('The user belonging to the token no longer exists', 401));

  // 4. Check if user changed password after the JWT was issued
  if (!decoded.iat || userChangedPasswordAfter(user, decoded.iat))
    return next(new AppError('User recently changed password! Please log in again', 401));

  // Grant acces to protected route
  req.user = user;
  next();
});

export const restrictTo = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return userNotFound(next);
  if (!roles.includes(req.user.role)) return next(new AppError('You do not have permission to perform this action', 403));
  next();
};

export const forgotPassword = catchAsync(async (req: Request<ForgotPasswordBody>, res, next) => {
  // 1. Get user based on POSTed email
  const user = await prisma.user.findFirst({ where: { email: req.body.email } });
  if (!user) return next(new AppError('There is no user with that email address', 404));

  // 2. Generate the random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  await prisma.user.update({
    data: {
      passwordResetToken: crypto.createHash('sha256').update(resetToken).digest('hex'),
      passwordResetExpires: add(Date.now(), { minutes: 10 }),
    },
    where: {
      id: user.id,
    },
  });

  // 3. Send it to user's email
  try {
    await sendResetPasswordEmail(user, resetToken);

    res.status(200).json({
      message: 'Token sent to email!',
    });
  } catch (err: unknown) {
    await prisma.user.update({
      data: {
        passwordResetToken: null,
        passwordResetExpires: null,
      },
      where: {
        id: user.id,
      },
    });

    return next(new AppError(`There was an error sending the email. Try again later!`, 500));
  }
});

export const resetPassword = catchAsync(async (req: Request<ResetPasswordBody>, res, next) => {
  // 1. Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await prisma.user.findFirst({
    where: { passwordResetToken: hashedToken, passwordResetExpires: { gt: new Date() } },
    include: { UserPreference: true },
  });

  // 2. If token has not expired, and there is user, set the new password
  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  await prisma.user.update({
    data: {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: new Date(),
      passwordResetToken: null,
      passwordResetExpires: null,
    },
    where: {
      id: user.id,
    },
  });

  // 4. Log the user in, send JWT
  createAndSendToken(user, 200, res);
});
