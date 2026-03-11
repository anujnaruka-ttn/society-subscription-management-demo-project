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