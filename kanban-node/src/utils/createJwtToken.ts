import jwt from "jsonwebtoken";

const createJWTToken = (id: string, email: string) => {

    const token = jwt.sign({ id, email }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_TOKEN_EXP as string });

    return token;
}

export default createJWTToken;