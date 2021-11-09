process.env.TOKEN_KEY = 'test';

import { elastic } from '../elastic';
import { sequelize } from '../sequelize';
import { Checker } from '../util/classes/Checker';

jest.setTimeout(25000);

jest.mock('node-fetch');
// For some reason not working, temporary substituted with @ts-ignores
// const mockedFetch = fetch as jest.Mocked<typeof fetch>;

beforeAll(async () => {
    Checker.checkEnvironment();
    await elastic.checkConnection({ init: true });
});

afterAll(async () => {
    await sequelize.close();
});