import { catchAsync } from "../utils/catchAsync";
import { Request, Response } from "express";
import { getAllSubscriptions } from "../services/subscription.service";
import { success } from "../utils/response";

const getAllSubscriptionsController = catchAsync(
    async (_req: Request, res: Response) => {
        const subscriptions = await getAllSubscriptions();
        return success(res, "Subscriptions fetched successfully", subscriptions);
    }
)

export {
    getAllSubscriptionsController
}