process.env.TOKEN_KEY = 'test';

import { sequelize } from '../connection';
import { Collection } from '../models/Collection';
import { CollectionItem } from '../models/CollectionItem';
import { Item } from '../models/Item';
import { ItemHierarchy } from '../models/ItemHierarchy';
import { User } from '../models/User';

import { checkEnvironment } from '../util/checkEnvironment';

jest.setTimeout(25000);

jest.mock('node-fetch');
// For some reason not working, temporary substituted with @ts-ignores
// const mockedFetch = fetch as jest.Mocked<typeof fetch>;

beforeAll(async () => {
    checkEnvironment();
});

afterAll(async () => {
    await sequelize.close();
});