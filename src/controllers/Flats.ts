import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { success } from "../utils/response";
import { 
    findAllResidents, 
    findAllFlats, 
    addFlatDetails, 
    updateFlatDetails,
    softDeleteFlat 
} from "../services/flat.service";
import { FlatDetailsInput, FlatUpdateInput} from "../validations/flat.validation";
import { IdParamInput } from "../validations/base.validation";

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
    async (req: Request<{}, {}, FlatDetailsInput>, res: Response) => {
        const flat = await addFlatDetails(req.body);
        return success(res, "Flat added successfully", flat);
    }
)

const updateFlatById = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params as IdParamInput;
        const updatedFlat = await updateFlatDetails(id, req.body as FlatUpdateInput);
        return success(res, "Flat updated successfully", updatedFlat);
    }
)

const deleteFlat = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params as IdParamInput;
        const flatId = Array.isArray(id) ? id[0] : id;
        const deletedFlat = await softDeleteFlat(flatId);
        return success(res, "Flat deactivated successfully", deletedFlat);
    }
)

export {
    getAllResidents,
    getAllFlats,
    addFlat,
    updateFlatById,
    deleteFlat
};
