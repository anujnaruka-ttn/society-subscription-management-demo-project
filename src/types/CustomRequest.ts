import { Request } from "express";
import { ITokenPayload } from "../models/ITokenPayload";

export interface CustomRequest extends Request {
    user?: ITokenPayload;
}