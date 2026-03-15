import { z } from "zod";
import { baseUserZodSchema } from "./base.validation";

// Schema for Registration
const registerZodSchema = baseUserZodSchema.extend({
    password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for Login
const loginZodSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

// Schema for Google Login
const loginGoogleZodSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    auth0_id: z.string().min(1, "Auth0 ID is required"),
});

// Schema specifically for change password operation
const changePasswordZodSchema = z.object({
    email: z.email("Invalid email address"),
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(1, "New password is required"),
});

// Schema for Update Profile
const updateProfileZodSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    phone: z.string().length(10, "Phone number must be 10 digits").optional(),
    profileImage: z.string().optional(),
});

export {
    registerZodSchema,
    loginZodSchema,
    loginGoogleZodSchema,
    changePasswordZodSchema,
    updateProfileZodSchema
}

// Exporting types
export type RegisterInput = z.infer<typeof registerZodSchema>;
export type LoginInput = z.infer<typeof loginZodSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileZodSchema>;
export type LoginGoogleInput = z.infer<typeof loginGoogleZodSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordZodSchema>;
