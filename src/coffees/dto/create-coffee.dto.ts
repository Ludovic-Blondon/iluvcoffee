import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

export const createCoffeeSchema = z
    .object({
        title: z.string(),
        brand: z.string(),
        flavors: z.array(z.string()).optional().default([]),
    })
    .required();

export class CreateCoffeeDto extends createZodDto(createCoffeeSchema) {
    @ApiProperty({ example: 'Café noir' })
    title: string;

    @ApiProperty({ example: 'Nest Brand' })
    brand: string;

    @ApiProperty({ example: ['chocolat', 'vanille'], required: false, type: [String] })
    flavors: string[] = [];
}