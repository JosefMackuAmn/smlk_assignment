process.env.TOKEN_KEY = 'test';

import { sequelize } from '../sequelize';
import { Checker } from '../util/classes/Checker';

jest.setTimeout(25000);

jest.mock('node-fetch');
// For some reason not working, temporary substituted with @ts-ignores
// const mockedFetch = fetch as jest.Mocked<typeof fetch>;

beforeAll(async () => {
    Checker.checkEnvironment();
});

afterAll(async () => {
    await sequelize.close();
});