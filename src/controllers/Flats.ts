import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { success } from "../utils/response";
import { findAllResidents, findAllFlats, addFlatDetails, softDeleteFlat } from "../services/flat.service";
import { FlatDetailsInput } from "../validations/flat.validation";

const getAllResidents = catchAsync(
    async (_req: Request, res: Response) => {
        const residents = await findAllResidents();
        return success(res, "Residents fetched successfully", residents);
    }
)

const getAllFlats = catchAsync(
    async (_req: Request, res: Response) => {
        const flats = await findAllFlats();
        return success(res, "Flats fetched successfully", flats);
    }
)

const addFlat = catchAsync(
    async (req: Request, res: Response) => {
        const flatData: FlatDetailsInput = req.body;
        
        const newFlat = await addFlatDetails(flatData);
        
        return success(res, "Flat added successfully", newFlat);
    }
)

const deleteFlat = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        
        const flatId = Array.isArray(id) ? id[0] : id;
        const deletedFlat = await softDeleteFlat(flatId);
        
        return success(res, "Flat deleted successfully", deletedFlat);
    }
)

export {
    getAllResidents,
    getAllFlats,
    addFlat,
    deleteFlat
}