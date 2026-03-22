import { catchAsync } from "../utils/catchAsync";
import { Request, Response } from "express";
import { getAllSubscriptions, updateSubscription } from "../services/subscription.service";
import { findBillingRecordsByFlatOwner, findBillingRecordsByFlatOwnerAndMonth, updateBillingRecordByFlatId } from "../services/billing.service";
import { success, unauthorized } from "../utils/response";
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
        if (!user) return unauthorized(res, "Resident not found");

        // The user's id is the owner_id on the flat
        const records = await findBillingRecordsByFlatOwner(user.id);
        return success(res, "Resident billing records fetched successfully", records);
    }
)

const getResidentSubscriptionDetailsByMonth = catchAsync(
    async (req: Request, res: Response) => {
        const user = (req as CustomRequest).user;
        const { month } = req.params; // format: YYYY-MM
        if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

        if (!month || typeof month !== 'string') {
            return res.status(400).json({ success: false, message: "Month parameter is required in YYYY-MM format" });
        }

        const [yearStr, monthStr] = month.split('-');
        const parsedYear = parseInt(yearStr);
        const parsedMonth = parseInt(monthStr);

        if (isNaN(parsedYear) || isNaN(parsedMonth)) {
            return res.status(400).json({ success: false, message: "Invalid month format. Expected YYYY-MM" });
        }

        // The user's id is the owner_id on the flat
        const records = await findBillingRecordsByFlatOwnerAndMonth(user.id, parsedMonth, parsedYear);
        return success(res, "Resident billing records for month fetched successfully", records);
    }
)

const updatePaymentStatusController = catchAsync(
    async (req: Request, res: Response) => {
        const user = (req as CustomRequest).user;
        const { paymentId, flatId, month, year } = req.body;
        
        if (!user) return unauthorized(res, "User not found");
        if (!paymentId || !flatId) {
            return res.status(400).json({ 
                success: false, 
                message: "Payment ID and Flat ID are required" 
            });
        }

        // Update the billing record for this flatId with payment information
        const updatedRecord = await updateBillingRecordByFlatId(flatId, {
            paymentId: paymentId,
            paymentMode: "online_razorpay",
            amountPaid: undefined, // Will use amount_due from billing record
            month: month,
            year: year
        });

        if (!updatedRecord) {
            return res.status(404).json({ 
                success: false, 
                message: "Billing record not found" 
            });
        }

        return success(res, "Payment status updated successfully", updatedRecord);
    }
)

export {
    getAllSubscriptionsController,
    getResidentSubscriptionDetails,
    getResidentSubscriptionDetailsByMonth,
    updateMonthlyRate,
    updatePaymentStatusController
}