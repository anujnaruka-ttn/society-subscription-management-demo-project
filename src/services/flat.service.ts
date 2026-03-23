import { query } from "../config/db";
import { IFlat } from "../models/IFlat";
import { 
    ALL_RESIDENTS, 
    GET_ALL_FLATS, 
    INSERT_FLAT, 
    UPDATE_FLAT, 
    SOFT_DELETE_FLAT, 
    UPDATE_USERS_FLAT_ID, 
    INSERT_BILLING_RECORD,
    GET_FLAT_BY_ID,
    GET_MONTHLY_RATE_BY_FLAT_TYPE,
    UPDATE_BILLING_FOR_USERS
} from "../queries/flat.queries";
import { FlatDetailsInput, FlatUpdateInput } from "../validations/flat.validation";

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
        // Insert new flat
        const flatResult = await query(INSERT_FLAT, [
            flatData.flat_number,
            flatData.floor_number,
            flatData.flat_type,
            flatData.owner_id || null,
            flatData.resident_ids || []
        ]);
        
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

const updateFlatDetails = async (flatId: string, updateData: FlatUpdateInput): Promise<IFlat> => {
    try {
        // Get current flat details to get flat_type
        const currentFlatResult = await query(GET_FLAT_BY_ID, [flatId]);
        const currentFlat = currentFlatResult.rows[0];
        
        if (!currentFlat) {
            throw new Error('Flat not found');
        }

        // Update flat details (only owner_id, resident_ids, is_active)
        const updateResult = await query(UPDATE_FLAT, [
            updateData.flat_number || currentFlat.flat_number,
            updateData.floor_number || currentFlat.floor_number,
            currentFlat.flat_type, // Keep existing flat_type
            updateData.owner_id || currentFlat.owner_id,
            updateData.resident_ids || currentFlat.resident_ids,
            flatId
        ]);
        
        const updatedFlat = updateResult.rows[0];
        
        // Handle owner and resident changes
        const userIdsToUpdate = [
            ...(updateData.owner_id ? [updateData.owner_id] : []),
            ...(updateData.resident_ids || [])
        ];

        if (userIdsToUpdate.length > 0) {
            // Update users with flat_id
            await query(UPDATE_USERS_FLAT_ID, [
                flatId,
                userIdsToUpdate
            ]);
            
            // Get monthly rate for billing update
            const rateResult = await query(GET_MONTHLY_RATE_BY_FLAT_TYPE, [currentFlat.flat_type]);
            const monthlyRate = rateResult.rows[0]?.monthly_rate || 0;
            
            // Update billing records for each user for next month
            for (const userId of userIdsToUpdate) {
                await query(UPDATE_BILLING_FOR_USERS, [
                    flatId,
                    userId,
                    monthlyRate
                ]);
            }
        }
        
        return updatedFlat;
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
    updateFlatDetails,
    softDeleteFlat
};
