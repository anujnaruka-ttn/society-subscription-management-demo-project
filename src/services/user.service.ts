import { query } from "../config/db"
import { IUser } from "../models/IUser"
import {
    CREATE_USER_QUERY,
    CREATE_USER_QUERY_GOOGLE,
    FIND_BY_MAIL_QUERY,
    UPDATE_AUTH_ID_QUERY,
    UPDATE_USER_PASSWORD_QUERY,
    UPDATE_USER_PROFILE_QUERY
} from "../queries/user.queries"
import { comparePassword, hashPassword } from "../utils/password";
import { ChangePasswordInput, LoginGoogleInput, RegisterInput, UpdateProfileInput } from "../validations/user.validation";

const createNewUser = async (data: RegisterInput): Promise<IUser> => {
    const { name, email, password } = data;
    const profileImage = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`;
    const result = await query(CREATE_USER_QUERY, [name, email, password, profileImage]);
    return result.rows[0]
}
const createNewUserGoogle = async (data: LoginGoogleInput): Promise<IUser> => {
    const { name, email, auth0_id } = data;
    const profileImage = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`;
    const result = await query(CREATE_USER_QUERY_GOOGLE, [name, email, auth0_id, profileImage]);
    return result.rows[0]
}
const findUserByEmail = async (email: string): Promise<IUser> => {
    const result = await query(FIND_BY_MAIL_QUERY, [email]);
    return result.rows[0]
}

const updateAuthId = async (email: string, auth0_id: string | null): Promise<IUser> => {
    const result = await query(UPDATE_AUTH_ID_QUERY, [auth0_id, email]);
    return result.rows[0]
}

const updateUserPassword = async (data: ChangePasswordInput): Promise<IUser> => {

    const { email, newPassword, oldPassword } = data;
    let isSameNewPassword: boolean;
    try {
        isSameNewPassword = await comparePassword(newPassword, oldPassword);
    } catch (err: Error | unknown) {
        throw err;
    }

    if (isSameNewPassword) throw new Error("New password cannot be same as old password");
    const hashedPassword = await hashPassword(newPassword);
    const result = await query(UPDATE_USER_PASSWORD_QUERY, [hashedPassword, email]);
    return result.rows[0]
}

const updateUserProfile = async (
    email: string,
    data: Partial<UpdateProfileInput>): Promise<IUser> => {
    const { name, phoneNumber, profileImage } = data;
    
    // Get current user to preserve fields not being updated
    const currentUser = await findUserByEmail(email);
    if (!currentUser) {
        throw new Error("User not found");
    }
    
    // Use provided values or keep existing ones
    const updateName = name !== undefined && name !== null ? name : currentUser.name;
    const updatePhoneNumber = phoneNumber !== undefined && phoneNumber !== null ? phoneNumber : currentUser.phone_number;
    const updateProfileImage = profileImage !== undefined && profileImage !== null ? profileImage : currentUser.profile_image;
    
    const result = await query(UPDATE_USER_PROFILE_QUERY, [updateName, updatePhoneNumber, updateProfileImage, email]);
    return result.rows[0]
}
export {
    findUserByEmail,
    updateAuthId,
    createNewUser,
    createNewUserGoogle,
    updateUserPassword,
    updateUserProfile
}