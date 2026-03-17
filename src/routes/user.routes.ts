import { Router } from "express";
import { validate } from "../middlewares/validate";
import {
    loginZodSchema,
    registerZodSchema,
    changePasswordZodSchema,
    updateProfileZodSchema,
    loginGoogleZodSchema
} from "../validations/user.validation";
import {
    login,
    residentRegister,
    changePassword,
    changeProfile,
    loginGoogle
} from "../controllers/AUTH";
import { auth } from "../middlewares/auth";

const userRouter = Router();

userRouter.post("/auth/login", validate({ body: loginZodSchema }), login);
userRouter.post("/auth/register", validate({ body: registerZodSchema }), residentRegister);
userRouter.put("/change-password", validate({ body: changePasswordZodSchema }), auth, changePassword);
userRouter.put("/change-profile", validate({ body: updateProfileZodSchema }), auth, changeProfile);
userRouter.post("/auth/login-google", validate({ body: loginGoogleZodSchema }), loginGoogle);

export default userRouter;