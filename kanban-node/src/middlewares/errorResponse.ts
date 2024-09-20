import type { NextFunction, Request, Response } from "express";
import CustomError from "../utils/CustomError";
import { CODE_500, ERR_INTERNAL_SERVER } from "../utils/translations";
import ApiResponse from "../utils/apiResponse";

export const errorResponse = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || CODE_500;
  error.message = error.message || ERR_INTERNAL_SERVER;

  res.status(error.statusCode).json(new ApiResponse(error.statusCode,{},error.message));
};
