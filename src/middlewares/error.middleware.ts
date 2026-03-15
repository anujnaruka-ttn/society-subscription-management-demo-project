import { NextFunction, Request, Response } from "express";
import { error as errorResponse } from "../utils/response";

export const globalErrorHandler = (
    err: any,
    _req: Request,
    res: Response,
    next: NextFunction
): void => {
    // 1. If headers have already been sent, delegate to the default Express error handler
    if (res.headersSent) {
        return next(err);
    }

    // 2. Set default status code and message
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // 3. Use your existing `error` response utility
    errorResponse(res, message, statusCode, err);
};
