import { IUser } from "../models/IUser";
import { ITokenPayload } from "../models/ITokenPayload";
import generateToken from "./generateToken";

export const generateAuthResponse = (user: IUser) => {

    // 1. Generate the JWT token payload
    const tokenPayload: ITokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role || "resident", // fallback to default role
        auth0_id: user.auth0_id || ""  // fallback just in case
    };

    // 2. Generate Token
    const token = generateToken(tokenPayload);

    // 3. Construct response object (stripping out password)
    return {
        id: user.id,
        name: user.name, // this handles returning name to frontend so we don't need a separate call
        email: user.email,
        role: user.role || "resident",
        auth0_id: user.auth0_id,
        profile_image: user.profile_image,
        token: token
    };
};
