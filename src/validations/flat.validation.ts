import { z } from "zod";

export const flatZodSchema = z.object({
    id: z.uuid("Invalid ID").optional(),
    flat_type: z.string().min(1, "Flat type is required"),
    flat_number: z.string().min(1, "Flat number is required"),
    floor_number: z.number().int().positive("Floor number must be a positive integer"),
    owner_id: z.uuid("Invalid owner ID").optional(),
    resident_ids: z.array(z.uuid("Invalid resident ID")).optional()
});

export const idParamZodSchema = z.object({
    id: z.uuid("Invalid ID")
});

export type FlatDetailsInput = z.infer<typeof flatZodSchema>;
export type IdParamInput = z.infer<typeof idParamZodSchema>;