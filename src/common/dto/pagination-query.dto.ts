import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const paginationQuerySchema = z.object({
    limit: z
        .number()
        .int()
        .positive()
        .optional(),
    offset: z
        .number()
        .int()
        .positive()
        .optional(),
});

export class PaginationQueryDto extends createZodDto(paginationQuerySchema) {
    @ApiProperty({ example: 10 })
    limit: number;

    @ApiProperty({ example: 0 })
    offset: number;
}