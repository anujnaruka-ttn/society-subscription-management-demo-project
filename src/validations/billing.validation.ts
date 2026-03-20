import { z } from "zod";

export const billingStatusZodSchema = z.object({
    status: z.enum(['pending', 'paid', 'overdue', 'cancelled'])
});

export const billingQueryZodSchema = z.object({
    month: z.string().regex(/^(0?[1-9]|1[0-2])$/, "Month must be between 1 and 12"),
    year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number")
});

export const idParamZodSchema = z.object({
    id: z.uuid("Invalid ID")
});

export type BillingStatusInput = z.infer<typeof billingStatusZodSchema>;
export type BillingQueryInput = z.infer<typeof billingQueryZodSchema>;
export type IdParamInput = z.infer<typeof idParamZodSchema>;
