import { z } from 'zod';

export const createCoffeeSchema = z
    .object({
        title: z.string(),
        brand: z.string(),
        flavors: z.array(z.string()).optional().default([]),
    })
    .required();

export type CreateCoffeeDto = z.infer<typeof createCoffeeSchema>;
