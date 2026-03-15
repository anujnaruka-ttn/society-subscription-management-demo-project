import { z } from "zod";

const updateSubscriptionZodSchema = z.object({
    flat_type: z.string().toUpperCase().pipe(z.enum(["1BHK", "2BHK", "3BHK", "4BHK"])),
    monthly_rate: z.number().positive(),
    effective_from: z.coerce.date("Invalid Date")
});

export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionZodSchema>;

export {
    updateSubscriptionZodSchema
}