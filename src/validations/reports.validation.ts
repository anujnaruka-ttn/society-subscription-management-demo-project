import { z } from "zod";

const formatEnum = z.enum(['csv', 'pdf']);
const rangeEnum = z.enum(['monthly', 'yearly']);

export const reportBodyZodSchema = z.object({
    format: formatEnum,
    range: rangeEnum,
    month: z.string().regex(/^(0?[1-9]|1[0-2])$/, "Month must be between 1 and 12").optional(),
    year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number").optional()
});

export type ReportBodyInput = z.infer<typeof reportBodyZodSchema>;
