import { Router } from "express";
import {
    getAllSubscriptionsController,
    updateMonthlyRate
} from "../controllers/Subscription";
import { auth, isAdmin } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { updateSubscriptionZodSchema } from "../validations/subscription.validation";

const subscriptionRouter = Router();

subscriptionRouter.get("/", auth, isAdmin, getAllSubscriptionsController);
subscriptionRouter.put("/update-monthly-rate", validate({ body: updateSubscriptionZodSchema }), auth, isAdmin, updateMonthlyRate);

export default subscriptionRouter;