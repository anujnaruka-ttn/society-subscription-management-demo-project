import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["production", "development"]).default("development"),
    DATABASE_URL: z.url("Invalid Database Url"),
    FRONTEND_URL: z.url("Frontend url is required."),
    PORT: z.coerce.number().default(4000),
    JWT_SECRET: z.string().min(10, "JWT Secret must be 10 characters long"),
    FOLDER_NAME: z.string().min(1, "FOLDER_NAME is required"),
    CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
    CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
    CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
})

const { success, data, error } = envSchema.safeParse(process.env);

if (!success) throw new Error(error.message);

export const ENV = data;
