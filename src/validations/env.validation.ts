import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["production", "development"]).default("development"),
    DATABASE_URL: z.url("Invalid Database Url")
})

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) throw new Error(parsedEnv.error.message);

export const ENV = parsedEnv.data;
