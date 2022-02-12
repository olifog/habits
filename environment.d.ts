declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET: string;
      DYNAMODB_SECRET_ACCESS_KEY: string;
      DYNAMODB_ACCESS_KEY_ID: string;
      GITHUB_CALLBACK_URL: string
      GITHUB_CLIENT_ID: string
      GITHUB_CLIENT_SECRET: string
    }
  }
}

export {}