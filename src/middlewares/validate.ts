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
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        
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
            req.query = parsed.data as any;
        }

        if (schemas.params) {
            const parsed = schemas.params.safeParse(req.params);
            if (!parsed.success) {
                badRequest(res, parsed.error.issues[0].message);
                return;
            }
            req.params = parsed.data as any;
        }

        next();
    });
};