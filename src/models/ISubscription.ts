import { FlatType } from "../types/flatTypes";

export interface ISubscription {
    id: string;
    flat_type: FlatType;
    monthly_rate: number;
    effective_from: Date;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}