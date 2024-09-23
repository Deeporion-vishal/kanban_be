import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError";
import { CODE_403, ERR_UNAUTHORIZED } from "../utils/translations";
import { IUser } from "@kanban/sdk/bin/link/models/database";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const getToken = (token: string) => {
  return token.split(" ")[1];
};


const verifyToken = (req:Request, res: Response, next: NextFunction) => {
  const token = req.cookies.AUTH_TOKEN;

  if (!token || !token.includes("Bearer"))
    return next(new CustomError(ERR_UNAUTHORIZED, CODE_403));

  jwt.verify(
    getToken(token),
    process.env.JWT_SECRET as string,
    (error: unknown, decodedToken: any) => {
      if (error) {
        console.log("VERIFY JWT TOKEN", error);
        return next(new CustomError(ERR_UNAUTHORIZED, CODE_403));
      }
      req.user = decodedToken;
      next();
    }
  );
};

export default verifyToken;
