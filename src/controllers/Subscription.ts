import { catchAsync } from "../utils/catchAsync";
import { Request, Response } from "express";
import { getAllSubscriptions, updateSubscription } from "../services/subscription.service";
import { success } from "../utils/response";

const getAllSubscriptionsController = catchAsync(
    async (_req: Request, res: Response) => {
        const subscriptions = await getAllSubscriptions();
        return success(res, "Subscriptions fetched successfully", subscriptions);
    }
)

const updateMonthlyRate = catchAsync(
    async (req: Request, res: Response) => {
        const updatedSubscription = await updateSubscription(req.body);
        return success(res, "Monthly rate updated successfully", updatedSubscription);
    }
)
export {
    getAllSubscriptionsController,
    updateMonthlyRate
}