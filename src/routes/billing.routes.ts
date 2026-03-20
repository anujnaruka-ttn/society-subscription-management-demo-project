import { Router } from "express";
import { auth, isAdmin } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { 
    getAllBillingRecords, 
    getBillingRecordsByMonth, 
    updateBillingStatus, 
    deleteBillingRecord 
} from "../controllers/Billing";
import { 
    billingStatusZodSchema, 
    billingQueryZodSchema, 
    idParamZodSchema 
} from "../validations/billing.validation";

const billingRouter = Router();

billingRouter.get("/", auth, isAdmin, getAllBillingRecords);
billingRouter.get("/month", auth, isAdmin, validate({ query: billingQueryZodSchema }), getBillingRecordsByMonth);
billingRouter.put("/:id/status", auth, isAdmin, validate({ params: idParamZodSchema, body: billingStatusZodSchema }), updateBillingStatus);
billingRouter.delete("/:id", auth, isAdmin, validate({ params: idParamZodSchema }), deleteBillingRecord);

export default billingRouter;
