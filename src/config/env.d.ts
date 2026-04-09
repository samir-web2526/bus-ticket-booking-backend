interface EnvConfig {
    NODE_ENV: string;
    PORT: string;
    DATABASE_URL: string;
    FRONTEND_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: number;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRES_IN: number;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
    ADMIN_NAME: string;
    ADMIN_PHONE: string;
}
export declare const envVars: EnvConfig;
export {};
//# sourceMappingURL=env.d.ts.map