import { NextFunction, Request, Response } from "express";
import { error as errorResponse } from "../utils/response";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // 1. Set default status code and message
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // 2. Use your existing `error` response utility
    errorResponse(res, message, statusCode, err);
};
