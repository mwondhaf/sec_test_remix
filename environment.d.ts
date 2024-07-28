declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      NODE_ENV: "development" | "production";
      EMAIL_HOST: string;
      EMAIL_PORT: number;
      EMAIL_AUTH_USER: string;
      EMAIL_AUTH_PASS: string;
      BASE_URL: string;
      LIBRE_URL: string;
    }
  }
}

export {};
