import { z } from 'zod';

export const coffeeParamSchema = z.string().refine(id => !isNaN(Number(id)), {
    message: 'ID must be a number',
}).transform(val => Number(val));

export type CoffeeParamSchema = z.infer<typeof coffeeParamSchema>;