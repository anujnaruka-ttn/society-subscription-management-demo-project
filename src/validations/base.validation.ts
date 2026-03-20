import { z } from "zod";

// Base schema with common fields
export const baseUserZodSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    phone: z.string().length(10, "Phone number must be 10 digits").optional(),
});

export const idParamZodSchema = z.object({
    id: z.uuid("Invalid ID")
});

export type BaseUserInput = z.infer<typeof baseUserZodSchema>;
export type IdParamInput = z.infer<typeof idParamZodSchema>;
