import { Router } from "express";
import { auth, isAdmin } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { addFlat, getAllResidents } from "../controllers/Flats";
import { flatZodSchema } from "../validations/flat.validation";

const flatRouter = Router();

flatRouter.get("/residents", auth, isAdmin, getAllResidents);
flatRouter.post("/add-flat", auth, isAdmin, validate({ body: flatZodSchema }), addFlat);

export default flatRouter;