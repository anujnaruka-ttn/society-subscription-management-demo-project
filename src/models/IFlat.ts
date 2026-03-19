import { query } from "../config/db";
import { CREATE_FLATS_TABLE, ALTER_USERS_FLAT_FK } from "../queries/schemas";
import { FlatType } from "../types/flatTypes";

export interface IFlat {
    id: string;
    flat_number: string;
    floor_number: number;
    flat_type: FlatType;
    owner_id?: string;
    resident_ids?: string[];
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export const initFlats = async () => {
    await query(CREATE_FLATS_TABLE);
    await query(ALTER_USERS_FLAT_FK);
    console.log("Flats table initialized successfully");
};