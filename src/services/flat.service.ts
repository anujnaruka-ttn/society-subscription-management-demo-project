import { query } from "../config/db";
import { IFlat } from "../models/IFlat";
import { ALL_RESIDENTS, GET_ALL_FLATS, INSERT_FLAT, UPDATE_FLAT, SOFT_DELETE_FLAT, UPDATE_USERS_FLAT_ID, INSERT_BILLING_RECORD, GET_MONTHLY_RATE_BY_FLAT_TYPE } from "../queries/flat.queries";
import { FlatDetailsInput } from "../validations/flat.validation";


const findAllResidents = async () => {
    const result = await query(ALL_RESIDENTS);
    return result.rows;
}

const findAllFlats = async () => {
    const result = await query(GET_ALL_FLATS);
    return result.rows;
}

const addFlatDetails = async (
    flatData: FlatDetailsInput
): Promise<IFlat> => {
    try {
        let flatResult;
        
        // Check if this is an update (has id) or create (no id)
        if (flatData.id) {
            // Update existing flat
            flatResult = await query(UPDATE_FLAT, [
                flatData.flat_number,
                flatData.floor_number,
                flatData.flat_type,
                flatData.owner_id || null,
                flatData.resident_ids || [],
                flatData.id
            ]);
            console.log(`Updated existing flat ${flatData.id}`);
        } else {
            // Insert new flat
            flatResult = await query(INSERT_FLAT, [
                flatData.flat_number,
                flatData.floor_number,
                flatData.flat_type,
                flatData.owner_id || null,
                flatData.resident_ids || []
            ]);
            
            const newFlat = flatResult.rows[0];
            
            // Create billing record for new flat only
            const rateResult = await query(GET_MONTHLY_RATE_BY_FLAT_TYPE, [flatData.flat_type]);
            const monthlyRate = rateResult.rows.length > 0 ? rateResult.rows[0].monthly_rate : 0;
            
            await query(INSERT_BILLING_RECORD, [newFlat.id, monthlyRate]);
        }
        
        const flat = flatResult.rows[0];
        
        // Update owner and residents with the flat_id
        const userIdsToUpdate = [
            ...(flatData.owner_id ? [flatData.owner_id] : []),
            ...(flatData.resident_ids || [])
        ];

        if (userIdsToUpdate.length > 0) {
            await query(UPDATE_USERS_FLAT_ID, [
                flat.id,
                userIdsToUpdate
            ]);
        }
        
        return flat;

    } catch (error) {
        throw error;
    }
}

const softDeleteFlat = async (flatId: string): Promise<IFlat> => {
    try {
        const result = await query(SOFT_DELETE_FLAT, [flatId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export {
    findAllResidents,
    findAllFlats,
    addFlatDetails,
    softDeleteFlat
}