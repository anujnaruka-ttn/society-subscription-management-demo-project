import { query } from "../config/db"
import { IUser } from "../models/IUser"
import { CREATE_USER_QUERY, CREATE_USER_QUERY_GOOGLE, FIND_BY_MAIL_QUERY, UPDATE_AUTH_ID_QUERY } from "../queries/user.queries"

const createNewUser = async (name: string, email: string, password: string): Promise<IUser> => {
    const result = await query(CREATE_USER_QUERY, [name, email, password]);
    return result.rows[0]
}
const createNewUserGoogle = async (name: string, email: string, auth0_id: string): Promise<IUser> => {
    const result = await query(CREATE_USER_QUERY_GOOGLE, [name, email, auth0_id]);
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

export {
    findUserByEmail,
    updateAuthId,
    createNewUser,
    createNewUserGoogle
}