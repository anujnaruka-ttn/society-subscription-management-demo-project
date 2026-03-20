import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { success } from "../utils/response";
import {
    findAllBillingRecords,
    findBillingRecordsByMonth,
    updateBillingStatus as updateBillingStatusService,
    softDeleteBillingRecord,
    checkPaymentForBill
} from "../services/billing.service";

const getAllBillingRecords = catchAsync(
    async (_req: Request, res: Response) => {
        const billingRecords = await findAllBillingRecords();
        return success(res, "Billing records fetched successfully", billingRecords);
    }
)

const getBillingRecordsByMonth = catchAsync(
    async (req: Request, res: Response) => {

        const { month, year } = req.query;
        const billingMonth = parseInt(month as string);
        const billingYear = parseInt(year as string);

        if (isNaN(billingMonth) || isNaN(billingYear)) {
            return res.status(400).json({
                success: false,
                message: "Valid month and year are required"
            });
        }

        const billingRecords = await findBillingRecordsByMonth(billingMonth, billingYear);
        return success(res, "Billing records fetched successfully", billingRecords);
    }
)

const updateBillingStatus = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status: bodyStatus } = req.body;
        const { status: queryStatus } = req.query;

        const status = (queryStatus || bodyStatus) as string;

        const validStatuses = ['pending', 'paid', 'overdue', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be one of: pending, paid, overdue, cancelled"
            });
        }

        const billingId = Array.isArray(id) ? id[0] : id;
        const updatedRecord = await updateBillingStatusService(billingId, status);

        return success(res, "Billing status updated successfully", updatedRecord);
    }
)

const deleteBillingRecord = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const billingId = Array.isArray(id) ? id[0] : id;
        const deletedRecord = await softDeleteBillingRecord(billingId);

        return success(res, "Billing record deleted successfully", deletedRecord);
    }
)

const verifyPaymentForBill = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const billingId = Array.isArray(id) ? id[0] : id as string;
        const payment = await checkPaymentForBill(billingId);
        return success(res, "Payment status verified", { 
            exists: !!payment, 
            payment 
        });
    }
)

export {
    getAllBillingRecords,
    getBillingRecordsByMonth,
    updateBillingStatus,
    deleteBillingRecord,
    verifyPaymentForBill
};
