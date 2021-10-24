import { Sequelize } from 'sequelize';

let dbName = 'smlk';
if (process.env.NODE_ENV === 'test') {
    dbName += '_test';
}

const sequelize = new Sequelize(
    dbName, 'root', 'secret123', {
        dialect: 'mysql',
        host: 'localhost',
        logging: false
    }
)

export { sequelize };