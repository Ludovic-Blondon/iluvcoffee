import { z } from 'zod';

export const coffeeParamSchema = z.string().refine(id => !isNaN(Number(id)), {
    message: 'ID must be a number',
}).transform(val => Number(val));

export type CoffeeParamDto = z.infer<typeof coffeeParamSchema>;