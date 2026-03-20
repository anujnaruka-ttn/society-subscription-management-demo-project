import { Router } from "express";
import { auth, isAdmin } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
    getAllBillingRecords,
    getBillingRecordsByMonth,
    updateBillingStatus,
    deleteBillingRecord,
    verifyPaymentForBill
} from "../controllers/Billing";
import {
    billingStatusZodSchema,
    billingQueryZodSchema,
} from "../validations/billing.validation";
import { idParamZodSchema } from "../validations/base.validation";

const billingRouter = Router();

billingRouter.get("/", auth, isAdmin, getAllBillingRecords);
billingRouter.get("/month", auth, isAdmin, validate({ query: billingQueryZodSchema }), getBillingRecordsByMonth);
billingRouter.get("/:id/verify-payment", auth, isAdmin, validate({ params: idParamZodSchema }), verifyPaymentForBill);
billingRouter.put("/:id/update-status", auth, isAdmin, validate({ params: idParamZodSchema }), updateBillingStatus);
billingRouter.delete("/:id", auth, isAdmin, validate({ params: idParamZodSchema }), deleteBillingRecord);

export default billingRouter;
