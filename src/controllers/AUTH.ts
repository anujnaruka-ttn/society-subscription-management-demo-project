import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { badRequest, error, notFound, success, unauthorized } from "../utils/response";
import { comparePassword, hashPassword } from "../utils/password";
import { createNewUser, createNewUserGoogle, findUserByEmail, updateAuthId, updateUserPassword, updateUserProfile } from "../services/user.service";
import { IUser } from "../models/IUser";
import { generateAuthResponse } from "../utils/generateAuthResponse";
import { CustomRequest } from "../types/CustomRequest";
import { LoginInput } from "../validations/user.validation";

const login = catchAsync(
    async (req: Request, res: Response) => {

        const {
            email,
            password
        } = req.body as LoginInput;

        const user: IUser = await findUserByEmail(email);

        if (!user) return notFound(res, "User not found")

        let isPasswordValid: boolean;
        try {
            isPasswordValid = await comparePassword(password, user.password);
        } catch (err: Error | unknown) {
            return error(res, "Internal Server Error", 500, err)
        }

        if (!isPasswordValid) return error(res, "Invalid Credentials", 401);

        const responseData = generateAuthResponse(user);

        return success(res, "Login successful", responseData);
    }
);

const residentRegister = catchAsync(
    async (req: Request, res: Response) => {

        const {
            name,
            email,
            password,
        } = req.body;

        const user: IUser = await findUserByEmail(email);

        if (user) return badRequest(res, "User already exists");

        const hashedPassword = await hashPassword(password);

        const newUser: IUser = await createNewUser({name, email, password: hashedPassword});

        const responseData = generateAuthResponse(newUser);

        return success(res, "Register successful", responseData);
    }
);

const changePassword = catchAsync(
    async (req: Request, res: Response) => {

        const {
            email,
            oldPassword,
            newPassword,
        } = req.body;

        const user = (req as CustomRequest).user;

        if (!user) return unauthorized(res, "User not logged in.");

        const userData: IUser = await findUserByEmail(user.email);

        if (!userData) return notFound(res, "User not found")

        let isSamePassword: boolean;
        try {
            isSamePassword = await comparePassword(oldPassword, userData.password);
        } catch (err: Error | unknown) {
            return error(res, "Internal Server Error", 500, err)
        }

        if (!isSamePassword) return unauthorized(res, "Invalid Credentials");

        const updatedUser: IUser = await updateUserPassword({ email, newPassword, oldPassword });

        const responseData = generateAuthResponse(updatedUser);

        return success(res, "Password changed successfully", responseData);
    }
);

const changeProfile = catchAsync(
    async (req: Request, res: Response) => {

        const {
            name,
            phone,
            profileImage,
        } = req.body;

        const userData = (req as CustomRequest).user;

        if (!userData) return error(res, "User not found", 404);

        const user: IUser = await findUserByEmail(userData.email);

        if (!user) return notFound(res, "User not found")

        const updatedUser: IUser = await updateUserProfile(userData.email, { name, phone, profileImage });

        return success(res, "Profile updated successfully", updatedUser);

    }
);

const loginGoogle = catchAsync(
    async (req: Request, res: Response) => {
        const {
            name,
            email,
            auth0_id, // NextAuth will send `account.providerAccountId` here
        } = req.body;

        // 1. Find user by email
        let user: IUser = await findUserByEmail(email);

        if (!user) {
            // 2. If user does not exist, create a new record
            user = await createNewUserGoogle({name, email, auth0_id});
        } else if (!user.auth0_id || user.auth0_id !== auth0_id) {
            // 3. If user exists but auth_id is missing/different, update it
            user = await updateAuthId(email, auth0_id);
        }

        // 4. Format and return success alongside the generated token
        const responseData = generateAuthResponse(user);

        return success(res, "Google Login successful", responseData);
    }
);


export {
    login,
    residentRegister,
    changePassword,
    changeProfile,
    loginGoogle
}