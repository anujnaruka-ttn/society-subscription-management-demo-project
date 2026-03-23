import { Router } from "express";
import { auth, isAdmin } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { 
    getAllResidents, 
    getAllFlats, 
    addFlat, 
    updateFlatById,
    deleteFlat 
} from "../controllers/Flats";
import { flatZodSchema, flatUpdateZodSchema } from "../validations/flat.validation";
import { idParamZodSchema } from "../validations/base.validation";

const flatRouter = Router();

flatRouter.get("/residents", auth, isAdmin, getAllResidents);
flatRouter.get("/", auth, isAdmin, getAllFlats);
flatRouter.post("/add-flat", auth, isAdmin, validate({ body: flatZodSchema }), addFlat);
flatRouter.put("/:id", auth, isAdmin, validate({ body: flatUpdateZodSchema, params: idParamZodSchema }), updateFlatById);
flatRouter.delete("/:id", auth, isAdmin, validate({ params: idParamZodSchema }), deleteFlat);

export default flatRouter;