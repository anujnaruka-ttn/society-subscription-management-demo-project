import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { success } from "../utils/response";
import { findAllResidents, addFlatDetails } from "../services/flat.service";
import { FlatDetailsInput } from "../validations/flat.validation";

const getAllResidents = catchAsync(
    async (_req: Request, res: Response) => {
        const residents = await findAllResidents();
        return success(res, "Residents fetched successfully", residents);
    }
)

const addFlat = catchAsync(
    async (req: Request, res: Response) => {
        const flatData: FlatDetailsInput = req.body;
        
        const newFlat = await addFlatDetails(flatData);
        
        return success(res, "Flat added successfully", newFlat);
    }
)

export {
    getAllResidents,
    addFlat
}