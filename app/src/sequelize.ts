import { Sequelize } from 'sequelize';

const {
    DB_NAME,
    DB_HOST,
    DB_USER,
    DB_PASSWORD
} = process.env;

const sequelize = new Sequelize(
    DB_NAME!, DB_USER!, DB_PASSWORD!, {
        dialect: 'mysql',
        host: DB_HOST!,
        logging: false,
        pool: {
            max: 30
        }
    }
);

export { sequelize };