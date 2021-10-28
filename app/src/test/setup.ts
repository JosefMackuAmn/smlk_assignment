process.env.TOKEN_KEY = 'test';

import { sequelize } from '../connection';
import { Collection } from '../models/Collection';
import { CollItem } from '../models/CollItem';
import { Item } from '../models/Item';
import { User } from '../models/User';

jest.setTimeout(25000);

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

beforeEach(async () => {
    await CollItem.drop();
    await Collection.drop();
    await User.truncate();
    await Item.truncate();
    await sequelize.sync({ force: true });
    jest.clearAllMocks();
    // await sequelize.truncate({ cascade: true });
});

afterAll(async () => {
    await sequelize.close();
});