import { Router } from "express";
import { auth, isAdmin } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { addFlat, getAllResidents, getAllFlats, deleteFlat } from "../controllers/Flats";
import { flatZodSchema, idParamZodSchema } from "../validations/flat.validation";

const flatRouter = Router();

flatRouter.get("/residents", auth, isAdmin, getAllResidents);
flatRouter.get("/", auth, isAdmin, getAllFlats);
flatRouter.post("/add-flat", auth, isAdmin, validate({ body: flatZodSchema }), addFlat);
flatRouter.delete("/:id", auth, isAdmin, validate({ params: idParamZodSchema }), deleteFlat);

export default flatRouter;