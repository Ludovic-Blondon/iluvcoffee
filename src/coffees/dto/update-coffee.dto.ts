import { createCoffeeSchema } from './create-coffee.dto';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

export const updateCoffeeSchema = createCoffeeSchema.partial().refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
});

export class UpdateCoffeeDto extends createZodDto(updateCoffeeSchema) {
    @ApiProperty({ example: 'Café noir' })
    title: string;

    @ApiProperty({ example: 'Nest Brand' })
    brand: string;

    @ApiProperty({ example: ['chocolat', 'vanille'], required: false, type: [String] })
    flavors: string[] = [];
}