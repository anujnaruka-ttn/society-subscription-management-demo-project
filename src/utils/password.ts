import bcrypt from "bcrypt";

const comparePassword = async (password: string, hash: string): Promise<boolean> => await bcrypt.compare(password, hash);

const hashPassword = async (password: string): Promise<string> => await bcrypt.hash(password, 12);

export {
    comparePassword,
    hashPassword
}
