declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MDB_URI: string;
            NODE_ENV: 'development' | 'production';
        }
    }
};

export { };