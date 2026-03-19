import { z } from "zod";

const updateSubscriptionZodSchema = z.object({
    flat_type: z.string().pipe(z.enum(["1bhk", "2bhk", "3bhk", "4bhk"])),
    monthly_rate: z.number().positive(),
    effective_from: z.coerce.date("Invalid Date")
});

export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionZodSchema>;

export {
    updateSubscriptionZodSchema
}