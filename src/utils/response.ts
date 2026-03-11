import { Response } from "express";
import { IApiResponse } from "../models/IApiResponse";
import { ENV } from "../validations/env.validation";

const success = <T>(
    res: Response,
    message: string = "Request Successful",
    data: T | null = null,
    statusCode: number = 200
): Response<IApiResponse<T>> => {

    return res.status(statusCode).json({
        success: true,
        message,
        data
    })

};

const error = <T>(
    res: Response,
    message: string = "Error occured",
    statusCode: number = 500,
    errorDetails?: any
): Response<IApiResponse<T>> => {

    const response: IApiResponse<T> = {
        success: false,
        message
    }

    if (ENV.NODE_ENV === "development" && errorDetails) {
        response.error = errorDetails instanceof Error ?
            errorDetails.message :
            errorDetails;
    }

    return res.status(statusCode).json(response);

};

const notFound = <T = null>(
    res: Response,
    message: string = "Record not found"
): Response<IApiResponse<T>> => error(res, message, 404);

const unauthorized = <T = null>(
    res: Response,
    message: string = "Unauthorized access"
): Response<IApiResponse<T>> => error(res, message, 401);

const forbidden = <T = null>(
    res: Response,
    message: string = "Forbidden access"
): Response<IApiResponse<T>> => error(res, message, 403);

const badRequest = <T = null>(
    res: Response,
    message: string = "Bad Request"
): Response<IApiResponse<T>> => error(res, message, 400);

const validationError = <T = null>(
    res: Response,
    message: string = "Validation Error",
    details?: any,
): Response<IApiResponse<T>> => error(res, message, 422, details);

export {
    success,
    error,
    notFound,
    unauthorized,
    forbidden,
    badRequest,
    validationError
}