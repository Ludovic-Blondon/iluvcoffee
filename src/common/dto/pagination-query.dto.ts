import { z } from 'zod';

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

export type PaginationQueryDto = z.infer<typeof paginationQuerySchema>;
