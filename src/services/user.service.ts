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


const createNewUser = async (name: string, email: string, password: string): Promise<IUser> => {
    const profileImage = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`;
    const result = await query(CREATE_USER_QUERY, [name, email, password, profileImage]);
    return result.rows[0]
}
const createNewUserGoogle = async (name: string, email: string, auth0_id: string): Promise<IUser> => {
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

const updateUserPassword = async (data: { email: string, newPassword: string }): Promise<IUser> => {

    const { email, newPassword } = data;
    const result = await query(UPDATE_USER_PASSWORD_QUERY, [newPassword, email]);
    return result.rows[0]
}

const updateUserProfile = async (
    email: string,
    data: Partial<{
        name: string,
        phone: string,
        profileImage: string
    }>): Promise<IUser> => {
    const { name, phone, profileImage } = data;
    const result = await query(UPDATE_USER_PROFILE_QUERY, [name, phone, profileImage, email]);
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