import { sequelize } from '../connection';

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

beforeEach(async () => {
    await sequelize.truncate();
});

afterAll(async () => {
    await sequelize.close();
});