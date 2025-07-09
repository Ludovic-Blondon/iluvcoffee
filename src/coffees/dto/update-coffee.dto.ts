import { z } from 'zod';
import { createCoffeeSchema } from './create-coffee.dto';

export const updateCoffeeSchema = createCoffeeSchema.partial().refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
});

export type UpdateCoffeeDto = z.infer<typeof updateCoffeeSchema>;
