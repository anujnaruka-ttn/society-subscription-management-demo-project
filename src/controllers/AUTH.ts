import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";

const adminLogin = catchAsync(
    async (req: Request, res: Response) => {

        const {
            email: adminMailId,
            password: adminPassword
        } = req.body;
    }
);

const residentLogin = catchAsync(
    async (req: Request, res: Response) => {
        
    }
);

const residentRegister = catchAsync(
    async (req: Request, res: Response) => {

    }
);

export {
    adminLogin,
    residentLogin,
    residentRegister
}