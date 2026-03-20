import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { badRequest } from "../utils/response";
import { catchAsync } from "../utils/catchAsync";

interface ValidationSchemas {
    body?: ZodType;
    query?: ZodType;
    params?: ZodType;
}

export const validate = (schemas: ValidationSchemas) => {
    return catchAsync(

        async (req: Request, res: Response, next: NextFunction) => {

            if (schemas.body) {
                const parsed = schemas.body.safeParse(req.body);
                if (!parsed.success) {
                    badRequest(res, parsed.error.issues[0].message);
                    return;
                }
                req.body = parsed.data;
            }

            if (schemas.query) {
                const parsed = schemas.query.safeParse(req.query);
                if (!parsed.success) {
                    badRequest(res, parsed.error.issues[0].message);
                    return;
                }
                // Use Object.assign for individual properties instead of overwriting the query object
                for (const key in req.query) {
                    delete (req.query as any)[key];
                }
                Object.assign(req.query, parsed.data);
            }

            if (schemas.params) {
                const parsed = schemas.params.safeParse(req.params);
                if (!parsed.success) {
                    badRequest(res, parsed.error.issues[0].message);
                    return;
                }
                for (const key in req.params) {
                    delete (req.params as any)[key];
                }
                Object.assign(req.params, parsed.data);
            }

            next();
        }
    );
};