import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
    constructor(private readonly schema: ZodSchema) { }

    transform(value: unknown, _metadata: ArgumentMetadata) {
        const result = this.schema.safeParse(value);
        if (result.success) {
            return result.data;
        }
        throw new BadRequestException({
            statusCode: 400,
            message: 'Validation failed',
            errors: (result.error as ZodError).errors,
        });
    }
}