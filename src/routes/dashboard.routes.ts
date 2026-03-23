import { Router } from "express";
import { auth, isAdmin } from "../middlewares/auth";
import { 
    getDashboardStats 
} from "../controllers/Dashboard";

const dashboardRouter = Router();

// Dashboard routes - protected by auth middleware
dashboardRouter.get("/stats", auth,isAdmin, getDashboardStats);

export default dashboardRouter;
