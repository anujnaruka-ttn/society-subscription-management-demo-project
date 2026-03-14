import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { unauthorized } from "../utils/response";
import { ENV } from "../validations/env.validation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ITokenPayload } from "../models/ITokenPayload";
import { CustomRequest } from "../types/CustomRequest";


const auth = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const authHeader = req.header("Authorization")

        let token: string;

        (authHeader && authHeader.startsWith("Bearer "))
            ? token = authHeader.replace("Bearer ", "")
            : token = req.body?.token;


        if (!token) return unauthorized(res, "Authentication required: No token provided");

        try {
            const decodedToken: JwtPayload & ITokenPayload = jwt.verify(token, ENV.JWT_SECRET) as ITokenPayload;

            (req as CustomRequest).user = {
                id: decodedToken.id,
                email: decodedToken.email,
                role: decodedToken.role,
                auth0_id: decodedToken.auth0_id
            };
            next();
        } catch (error) {
            return unauthorized(res, "Authentication required: Invalid token");
        }



    }
)