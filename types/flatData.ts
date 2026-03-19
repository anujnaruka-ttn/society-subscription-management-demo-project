export interface FlatData {
    id: string;
    owner?: string;
    owner_id?: string;
    email?: string;
    phone?: string;
    flatAddress?: string;
    resident_ids?: string[];
    flat_number?: string;
    floor_number?: number;
    flat_type?: string;
    is_active?: boolean;
}

export interface ResidentData {
    id: string;
    name: string;
    email: string;
    phone_number?: string;
    profile_image?: string;
    role?: string;
}