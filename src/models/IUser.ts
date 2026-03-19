import { query } from "../config/db";
import { CREATE_USERS_TABLE } from "../queries/schemas";
import { Role } from "../types/roles";

export interface IUser {
    id: string;
    auth0_id?: string;
    password: string;
    name: string;
    email: string;
    profile_image?: string;
    phone_number?: string;
    role?: Role;
    flat_id?: string;
    one_signal_player_id?: string;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export const initUsers = async () => {
    await query(CREATE_USERS_TABLE);
    console.log("Users table initialized successfully");
};