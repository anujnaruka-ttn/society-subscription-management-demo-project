import { Role } from "../types/roles";

export interface IUser {
    id: string;
    auth0_id?: string;
    password: string;
    name: string;
    email: string;
    profile_image?: string;
    phone?: string;
    role?: Role;
    flat_id?: string;
    one_signal_player_id?: string;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
}