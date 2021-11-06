declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV?: string;
            TOKEN_KEY?: string;
            PORT?: string;
            DB_NAME?: string;
            DB_TEST_NAME?: string;
            DB_HOST?: string;
            DB_USER?: string;
            DB_PASSWORD?: string;
            ELASTIC_HOST?: string;
            ELASTIC_URL?: string;
        }
    }
}

export {};