import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["production", "development"]).default("development"),
    DATABASE_URL: z.url("Invalid Database Url"),
    PORT: z.coerce.number().default(4000)
})

const { success, data, error } = envSchema.safeParse(process.env);

if (!success) throw new Error(error.message);

export const ENV = data;
