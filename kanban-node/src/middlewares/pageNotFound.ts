import type { NextFunction, Request, Response } from "express";
import CustomError from "../utils/CustomError";
import { CODE_404, PAGE_NOT_FOUND } from "../utils/translations";

export const pageNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError(PAGE_NOT_FOUND, CODE_404);
  next(error);
};
