process.env.TOKEN_KEY = 'test';

import { sequelize } from '../connection';
import { Collection } from '../models/Collection';
import { User } from '../models/User';

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

beforeEach(async () => {
    await Collection.drop();
    await User.truncate();
    await sequelize.sync({ force: true });
    // await sequelize.truncate({ cascade: true });
});

afterAll(async () => {
    await sequelize.close();
});