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