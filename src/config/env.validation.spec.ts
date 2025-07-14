
import { validateEnv } from './env.validation';

describe('validateEnv', () => {
    const validConfig = {
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: '5432',
        DATABASE_USER: 'user',
        DATABASE_PASSWORD: 'password',
        DATABASE_NAME: 'mydb',
        API_KEY: 'secret-key',
    };

    it('should validate and return parsed env when config is valid', () => {
        const result = validateEnv(validConfig);
        expect(result).toEqual({
            DATABASE_HOST: 'localhost',
            DATABASE_PORT: 5432,
            DATABASE_USER: 'user',
            DATABASE_PASSWORD: 'password',
            DATABASE_NAME: 'mydb',
            API_KEY: 'secret-key',
        });
    });

    it('should throw error if required fields are missing', () => {
        const { DATABASE_HOST, ...invalidConfig } = validConfig;

        expect(() => validateEnv(invalidConfig)).toThrow('Invalid environment variables');
    });

    it('should use default port if DATABASE_PORT is missing', () => {
        const { DATABASE_PORT, ...configWithoutPort } = validConfig;

        const result = validateEnv(configWithoutPort);
        expect(result.DATABASE_PORT).toBe(5432);
    });

    it('should throw error if DATABASE_PORT cannot be coerced to number', () => {
        const invalidPortConfig = { ...validConfig, DATABASE_PORT: 'not-a-number' };

        expect(() => validateEnv(invalidPortConfig)).toThrow('Invalid environment variables');
    });
});
