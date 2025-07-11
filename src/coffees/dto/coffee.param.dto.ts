import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const coffeeParamSchema = z.object({
    id: z.string().refine(id => !isNaN(Number(id)), {
        message: 'ID must be a number',
    }).transform(val => Number(val)),
});

export class CoffeeParamDto extends createZodDto(coffeeParamSchema) {
    @ApiProperty({ example: 1 })
    id: number;
}