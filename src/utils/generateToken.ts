import { ITokenPayload } from "../models/ITokenPayload";
import jwt from "jsonwebtoken";
import { ENV } from "../validations/env.validation";

const generateToken = (payload: ITokenPayload) => {

    return jwt.sign(
        payload,
        ENV.JWT_SECRET,
        {
            expiresIn: "30d"
        }
    );
}

export default generateToken;
