import { catchAsync } from "../utils/catchAsync";
import { Request, Response } from "express";
import { getPaymentEntries, recordPayment, getPendingPayments } from "../services/payment.service";
import { success } from "../utils/response";

const getPaymentEntriesController = catchAsync(
    async (_req: Request, res: Response) => {
        const entries = await getPaymentEntries();
        return success(res, "Payment entries fetched successfully", entries);
    }
);

const recordPaymentController = catchAsync(
    async (req: Request, res: Response) => {
        const payment = await recordPayment(req.body);
        return success(res, "Payment recorded successfully", payment);
    }
);

const getPendingPaymentsController = catchAsync(
    async (_req: Request, res: Response) => {
        const pending = await getPendingPayments();
        return success(res, "Pending payments fetched successfully", pending);
    }
);

export {
    getPaymentEntriesController,
    recordPaymentController,
    getPendingPaymentsController
};
