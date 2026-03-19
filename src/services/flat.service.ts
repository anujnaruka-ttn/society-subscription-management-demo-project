import { query } from "../config/db";
import { IFlat } from "../models/IFlat";
import { ALL_RESIDENTS, INSERT_FLAT, UPDATE_USERS_FLAT_ID, INSERT_BILLING_RECORD } from "../queries/flat.queries";
import { FlatDetailsInput } from "../validations/flat.validation";


const findAllResidents = async () => {
    const result = await query(ALL_RESIDENTS);
    return result.rows;
}

const addFlatDetails = async (
    flatData: FlatDetailsInput
): Promise<IFlat> => {
    try {
        // Step 1: Insert one flat with all residents
        const flatResult = await query(INSERT_FLAT, [
            flatData.flat_number,
            flatData.floor_number,
            flatData.flat_type,
            flatData.owner_id || null,
            flatData.resident_ids || [] // Store all residents in the array
        ]);

        const newFlat = flatResult.rows[0];

        // Step 2: Update owner and residents with the same flat_id
        const userIdsToUpdate = [
            ...(flatData.owner_id ? [flatData.owner_id] : []),
            ...(flatData.resident_ids || [])
        ];

        if (userIdsToUpdate.length > 0) {
            await query(UPDATE_USERS_FLAT_ID, [
                newFlat.id, // Same flat_id for all users
                userIdsToUpdate
            ]);
        }

        // Step 3: Generate one billing record for the flat
        await query(INSERT_BILLING_RECORD, [newFlat.id]);

        return newFlat;

    } catch (error) {
        throw error;
    }
}

export {
    findAllResidents,
    addFlatDetails
}