import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { badRequest, error, notFound, success, unauthorized, validationError } from "../utils/response";
import { comparePassword, hashPassword } from "../utils/password";
import { createNewUser, createNewUserGoogle, findUserByEmail, updateAuthId, updateUserPassword, updateUserProfile } from "../services/user.service";
import { IUser } from "../models/IUser";
import { generateAuthResponse } from "../utils/generateAuthResponse";
import { CustomRequest } from "../types/CustomRequest";
import { LoginInput } from "../validations/user.validation";
import { UploadedFile } from "express-fileupload";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { ENV } from "../validations/env.validation";

const folderName = ENV.FOLDER_NAME;

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

        const newUser: IUser = await createNewUser({ name, email, password: hashedPassword });

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

        if (!userData) return notFound(res, "User not found");

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

        const user = (req as CustomRequest).user;

        if (!user) return unauthorized(res, "User not logged in.");

        const profileImage: UploadedFile = req.files?.profileImage as UploadedFile;

        if (!profileImage) {
            return validationError(res, 'Profile image is required');
        }

        console.log('Profile pic details:', {
            name: profileImage.name,
            size: profileImage.size,
            mimetype: profileImage.mimetype,
            tempFilePath: profileImage.tempFilePath
        });

        if (!["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(profileImage.mimetype)) {
            return validationError(res, 'Invalid file type. Only JPEG, JPG, PNG and WebP allowed.');
        }

        if (!profileImage.tempFilePath) {
            return error(res, 'Temporary file path not found. Make sure useTempFiles is enabled.');
        }

        console.log('Attempting to upload to Cloudinary...');
        const { secure_url } = await uploadToCloudinary(profileImage.tempFilePath, folderName);
        console.log('Cloudinary upload successful, secure URL:', secure_url);
        
        const updatedUser: IUser = await updateUserProfile(user.email, { profileImage: secure_url });

        if (!updatedUser) {
            return error(res, 'Failed to update profile image', 500);
        }

        return success(res, "Profile image updated successfully", updatedUser);

    }
);

const updateProfile = catchAsync(
    async (req: Request, res: Response) => {

        const {
            name,
            phoneNumber,
        } = req.body;

        const user = (req as CustomRequest).user;

        if (!user) return unauthorized(res, "User not logged in.");

        // Prepare update object - at least one field required
        const updateData: any = {};

        if (name && name.trim()) {
            updateData.name = name;
        }

        if (phoneNumber && phoneNumber.trim()) {
            updateData.phoneNumber = phoneNumber;
        }

        console.log('Update data prepared:', updateData);
        
        if (Object.keys(updateData).length === 0) {
            return validationError(res, 'At least one field (name or phone number) is required to update');
        }

        const updatedUser: IUser = await updateUserProfile(user.email, updateData);

        if (!updatedUser) {
            return error(res, 'Failed to update user profile', 500);
        }

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
            user = await createNewUserGoogle({ name, email, auth0_id });
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
    updateProfile,
    loginGoogle
}