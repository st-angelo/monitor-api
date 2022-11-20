declare module NodeJS {
  interface ProcessEnv {
    ENVIRONMENT: string;
    PORT: string;
    EMAIL: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_COOKIE_EXPIRES_IN: number;
    JWT_COOKIE_SUFFIX: string;
    EMAIL_HOST: string;
    EMAIL_PORT: string;
    EMAIL_USERNAME: string;
    EMAIL_PASSWORD: string;
    SENDGRID_USERNAME: string;
    SENDGRID_PASSWORD: string;
    CURRENCY_API_URL: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  }
}
