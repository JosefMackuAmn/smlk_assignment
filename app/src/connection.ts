import { Sequelize } from 'sequelize';

let dbName = 'smlk';
if (process.env.NODE_ENV === 'test') {
    dbName += '_test';
}

const sequelize = new Sequelize(
    dbName, 'root', '123456', {
        dialect: 'mysql',
        host: 'mysqldb',
        logging: false
    }
)

export { sequelize };