declare namespace Express {
  interface Request {
    user: import('@prisma/client').User & { UserPreference: import('@prisma/client').UserPreference | null };
  }
}
