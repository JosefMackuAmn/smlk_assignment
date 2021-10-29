declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN_KEY: string;
            MYSQLDB_USER: string;
            MYSQLDB_ROOT_PASSWORD: string;
            MYSQLDB_DATABASE: string;
            MYSQLDB_LOCAL_PORT: string;
            MYSQLDB_DOCKER_PORT: string;
            PORT: string;
            ELASTIC_HOST: string;
            ELASTIC_URL: string;
        }
    }
}

export {};