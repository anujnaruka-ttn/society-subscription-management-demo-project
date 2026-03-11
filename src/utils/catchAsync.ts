import { NextFunction, Request, Response } from "express";

// Define a type for the async controller function
type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const catchAsync = (
    fn: AsyncController
) => (
    request: Request,
    response: Response,
    next: NextFunction
) => fn(request, response, next).catch((err: Error) => next(err));

