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
    GET_MONTHLY_RATE_BY_FLAT_TYPE
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

        // Generate billing records for all users associated with this flat
        if (userIdsToUpdate.length > 0) {
            // Get monthly rate for this flat type
            const rateResult = await query(GET_MONTHLY_RATE_BY_FLAT_TYPE, [flatData.flat_type]);
            const monthlyRate = rateResult.rows[0]?.monthly_rate || 0;
            
            // Create billing records for current month for each user
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
            const currentYear = currentDate.getFullYear();
            
            for (const userId of userIdsToUpdate) {
                await query(INSERT_BILLING_RECORD, [
                    flat.id,
                    userId,
                    currentMonth,
                    currentYear,
                    monthlyRate,
                    new Date(currentYear, currentMonth - 1, 0).toISOString().split('T')[0] // Due date: last day of previous month
                ]);
            }
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

        // Update flat details (only owner_id, resident_ids, is_active - NOT flat_type, flat_number, floor_number)
        const updateResult = await query(UPDATE_FLAT, [
            flatId,
            currentFlat.flat_number, // Keep existing flat_number
            currentFlat.floor_number,  // Keep existing floor_number
            currentFlat.flat_type,       // Keep existing flat_type
            updateData.owner_id || currentFlat.owner_id,
            updateData.resident_ids || currentFlat.resident_ids
        ]);
        
        const updatedFlat = updateResult.rows[0];
        
        // Handle owner and resident changes
        const userIdsToUpdate = [
            ...(updateData.owner_id ? [updateData.owner_id] : []),
            ...(updateData.resident_ids ? updateData.resident_ids : [])
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
            
            // Create billing records for next month for each user
            const currentDate = new Date();
            const nextMonth = currentDate.getMonth() + 2; // Next month
            const nextYear = currentDate.getFullYear();
            
            for (const userId of userIdsToUpdate) {
                await query(INSERT_BILLING_RECORD, [
                    flatId,
                    userId,
                    nextMonth,
                    nextYear,
                    monthlyRate,
                    new Date(nextYear, nextMonth - 1, 0).toISOString().split('T')[0] // Due date: last day of previous month
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
