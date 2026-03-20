import { Router } from "express";
import { auth, isAdmin } from "../middlewares/auth";
import { getPaymentEntriesController, recordPaymentController, getPendingPaymentsController } from "../controllers/Payment";

const paymentRouter = Router();

paymentRouter.get("/entries", auth, isAdmin, getPaymentEntriesController);
paymentRouter.post("/record", auth, isAdmin, recordPaymentController);
paymentRouter.get("/pending", auth, isAdmin, getPendingPaymentsController);

export default paymentRouter;
