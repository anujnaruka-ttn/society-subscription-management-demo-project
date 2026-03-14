import { Role } from "../types/roles";

export interface ITokenPayload {
    id: string;
    email: string;
    role: Role;
    auth0_id: string;
}