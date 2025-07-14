
import { ZodValidationPipe } from './zod.validation.pipe';
import { z, ZodSchema } from 'zod';
import { BadRequestException } from '@nestjs/common';

describe('ZodValidationPipe', () => {
    const schema: ZodSchema = z.object({
        name: z.string(),
        age: z.number().min(18),
    });

    let pipe: ZodValidationPipe;

    beforeEach(() => {
        pipe = new ZodValidationPipe(schema);
    });

    it('should return parsed data when validation succeeds', () => {
        const validData = { name: 'Alice', age: 25 };

        expect(pipe.transform(validData, {} as any)).toEqual(validData);
    });

    it('should throw BadRequestException when validation fails', () => {
        const invalidData = { name: 'Bob', age: 16 };

        try {
            pipe.transform(invalidData, {} as any);
            fail('Expected BadRequestException to be thrown');
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException);
            expect(err.getResponse()).toMatchObject({
                statusCode: 400,
                message: 'Validation failed',
                errors: expect.any(Array),
            });
        }
    });
});
