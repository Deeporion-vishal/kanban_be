import type { NextFunction, Request, Response } from "express";
import CustomError from "./CustomError";
import { CODE_500, ERR_INTERNAL_SERVER } from "./translations";

const asyncErrorHandler = (
  asyncFunc: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await asyncFunc(req, res, next);
    } catch (error) {
      console.log(error);

      return next(
        new CustomError(
          (error as CustomError).message || ERR_INTERNAL_SERVER,
          (error as CustomError).statusCode || CODE_500
        )
      );
    }
  };
};

export default asyncErrorHandler;
