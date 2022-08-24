declare module NodeJS {
  interface ProcessEnv {
    ENVIRONMENT: string;
    PORT: string;
    DB_CONNECTION_STRING: string;
    DB_PASSWORD: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_COOKIE_EXPIRES_IN: number;
    JWT_COOKIE_SUFFIX: string;
    EMAIL_USERNAME: string;
    EMAIL_PASSWORD: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REFRESH_TOKEN: string;
    ACCESS_TOKEN: string;
  }
}
