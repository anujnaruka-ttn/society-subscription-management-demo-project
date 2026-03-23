import { z } from "zod";

export const flatZodSchema = z.object({
    id: z.uuid("Invalid ID").optional(),
    flat_type: z.string().min(1, "Flat type is required").optional(),
    flat_number: z.string().min(1, "Flat number is required").readonly().optional(),
    floor_number: z.number().int().positive("Floor number must be a positive integer").readonly().optional(),
    owner_id: z.uuid("Invalid owner ID").optional(),
    resident_ids: z.array(z.uuid("Invalid resident ID")).optional()
});

export const flatUpdateZodSchema = z.object({
    owner_id: z.uuid("Invalid owner ID").optional(),
    resident_ids: z.array(z.uuid("Invalid resident ID")).optional()
});


export type FlatDetailsInput = z.infer<typeof flatZodSchema>;
export type FlatUpdateInput = z.infer<typeof flatUpdateZodSchema>;
