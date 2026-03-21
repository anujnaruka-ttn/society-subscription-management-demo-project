import { catchAsync } from "../utils/catchAsync";
import { Request, Response } from "express";
import { getAllSubscriptions, updateSubscription } from "../services/subscription.service";
import { findBillingRecordsByFlatOwner } from "../services/billing.service";
import { success } from "../utils/response";
import { CustomRequest } from "../types/CustomRequest";

const getAllSubscriptionsController = catchAsync(
    async (_req: Request, res: Response) => {
        const subscriptions = await getAllSubscriptions();
        return success(res, "Subscriptions fetched successfully", subscriptions);
    }
)

const updateMonthlyRate = catchAsync(
    async (req: Request, res: Response) => {
        await updateSubscription(req.body);
        // Return full list so Redux stays in sync
        const allSubscriptions = await getAllSubscriptions();
        return success(res, "Monthly rate updated successfully", allSubscriptions);
    }
)

const getResidentSubscriptionDetails = catchAsync(
    async (req: Request, res: Response) => {
        const user = (req as CustomRequest).user;
        if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

        // The user's id is the owner_id on the flat
        const records = await findBillingRecordsByFlatOwner(user.id);
        return success(res, "Resident billing records fetched successfully", records);
    }
)

export {
    getAllSubscriptionsController,
    getResidentSubscriptionDetails,
    updateMonthlyRate
}