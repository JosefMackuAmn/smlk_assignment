process.env.TOKEN_KEY = 'test';

import { sequelize } from '../connection';
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