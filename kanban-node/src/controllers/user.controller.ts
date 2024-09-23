import type { NextFunction, Request, Response } from "express";
import { IBoard, IId, IUser, IUserDB } from "@kanban/sdk/bin/link";
import User from "../models/user.model";
import CustomError from "../utils/CustomError";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import createJWTToken from "../utils/createJwtToken";

import {
  BOARD,
  CODE_200,
  CODE_201,
  CODE_400,
  CODE_401,
  CODE_404,
  EMAIL_EXISTS,
  ERR_UNAUTHORIZED,
  INVALID_CREDENTIALS,
  PASSWORD,
  SUB_TASK_LIST,
  TASK_LIST,
  USER_DELETE_SUCCESS,
  USER_NOT_FOUND,
  USER_REG_SUCCESS,
  USER_SIGNOUT_SUCCESS,
} from "../utils/translations";
import {
  IGetAllUsersQueryParams,
  ISignInResponse,
  ISuccessResponse,
  IUserResponse,
  IUserSignIn,
  IUserUpdate,
} from "@kanban/sdk/bin/link/models/dto";
import ApiResponse from "../utils/apiResponse";

dotenv.config();

class UserController {
  static signUpUser = asyncErrorHandler(
    async (req: Request<{}, {}, IUser>, res: Response, next: NextFunction) => {
      const errorResults = validationResult(req);

      if (!errorResults.isEmpty()) {
        const errors: string[] = errorResults.array().map((err) => err.msg);
        return next(new CustomError(JSON.stringify(errors), CODE_400));
      }

      const bodyObj: IUser = req.body;
      const existingUser = await User.findOne({ email: bodyObj.email });
      if (existingUser) {
        return next(new CustomError(EMAIL_EXISTS, CODE_400));
      }

      const hashedPassword = await bcrypt.hash(bodyObj.password, 10);
      const user = await User.create({
        ...bodyObj,
        password: hashedPassword,
      });

      const token = createJWTToken(user.id.toString(), user.email);
      const refreshToken = jwt.sign(
        { user: user.id, email: user.email },
        process.env.JWT_REFRESH_TOKEN_SECRET as string,
        { expiresIn: process.env.JWT_TOKEN_EXP as string }
      );

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("AUTH_TOKEN", `Bearer ${token}`, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
      });

      const response = new ApiResponse(
        201,
        {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          boards: user.boards,
          accessToken: token,
          refreshToken: user.refreshToken,
        },
        USER_REG_SUCCESS
      );

      res.status(CODE_201).json(response);
    }
  );

  static signInUser = asyncErrorHandler(
    async (
      req: Request<{}, {}, IUserSignIn>,
      res: Response,
      next: NextFunction
    ) => {
      const errorResults = validationResult(req);

      if (!errorResults.isEmpty()) {
        const errors: string[] = errorResults.array().map((err) => err.msg);
        return next(new CustomError(JSON.stringify(errors), CODE_400));
      }

      const bodyObj: IUserSignIn = req.body;
      const user = await User.findOne({ email: bodyObj.email }).populate({
        path: "boards",
        populate: { path: "taskList", populate: { path: "subtaskList" } },
      });

      if (!user) {
        return next(new CustomError(INVALID_CREDENTIALS, CODE_401));
      }

      const passwordMatch = await bcrypt.compare(
        bodyObj.password,
        user.password as string
      );
      if (!passwordMatch) {
        return next(new CustomError(INVALID_CREDENTIALS, CODE_401));
      }

      const token = createJWTToken(user.id.toString(), user.email);
      const refreshToken = jwt.sign(
        { user: user.id, email: user.email },
        process.env.JWT_REFRESH_TOKEN_SECRET as string,
        { expiresIn: process.env.JWT_TOKEN_EXP as string }
      );

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("AUTH_TOKEN", `Bearer ${token}`, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
      });

      const response = new ApiResponse(200, {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        boards: user.boards,
        accessToken: token,
        refreshToken: user.refreshToken,
      });

      res.status(CODE_200).json(response);
    }
  );

  static signOutUser = (req: Request, res: Response<ISuccessResponse>) => {
    const response = new ApiResponse(200, {}, USER_SIGNOUT_SUCCESS);
    res.status(CODE_200).clearCookie("AUTH_TOKEN").json(response);
  };

  static getAllusers = asyncErrorHandler(
    async (
      req: Request<{}, {}, {}, IGetAllUsersQueryParams>,
      res: Response,
      next: NextFunction
    ) => {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const bodyObj: IGetAllUsersQueryParams = req.query;

      const usernameQuery = { $regex: new RegExp(bodyObj.username!, "i") };
      const emailQuery = { $regex: new RegExp(bodyObj.email!, "i") };

      const skipUsers = (page - 1) * limit;

      const users = (await User.find({
        username: usernameQuery,
        email: emailQuery,
      })
        .select("-password")
        .populate({
          path: BOARD,
          populate: { path: TASK_LIST, populate: { path: SUB_TASK_LIST } },
        })
        .skip(skipUsers)
        .limit(limit)
        .exec()) as IUser[];

      const usersResponse = users.map((user) => ({
        id: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username,
        boards: user.boards as unknown as IBoard[],
      }));

      const response = new ApiResponse(200, { users: usersResponse });
      res.status(CODE_200).json(response);
    }
  );

  static getUserById = asyncErrorHandler(
    async (req: Request<IId>, res: Response, next: NextFunction) => {
      const bodyObj: IId = req.params;
      const user = (await User.findById(bodyObj.id)
        .populate({
          path: BOARD,
          populate: { path: TASK_LIST, populate: { path: SUB_TASK_LIST } },
        })
        .select(PASSWORD)
        .exec()) as IUserDB;

      if (!user) {
        return next(new CustomError(USER_NOT_FOUND, CODE_404));
      }

      const response = new ApiResponse(200, {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        boards: user.boards,
      });

      res.status(CODE_200).json(response);
    }
  );

  static getUserByName = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { username } = req.params;
      const user = (await User.findOne({ username })
        .select(PASSWORD)
        .exec()) as IUserDB;

      if (!user) {
        return next(new CustomError(USER_NOT_FOUND, CODE_404));
      }

      const response = new ApiResponse(200, user);
      res.status(CODE_200).json(response);
    }
  );

  static updateUserById = asyncErrorHandler(
    async (
      req: Request<IId, {}, {}, IUserUpdate>,
      res: Response,
      next: NextFunction
    ) => {
      const bodyObj: IId = req.params;
      const newUserData: IUserUpdate = req.body;

      await User.findByIdAndUpdate(bodyObj.id, newUserData);
      const user = (await User.findById(bodyObj.id).select(
        PASSWORD
      )) as IUserDB;

      const response = new ApiResponse(200, user);
      res.status(CODE_200).json(response);
    }
  );

  static deleteUserById = asyncErrorHandler(
    async (req: Request<IId>, res: Response, next: NextFunction) => {
      const bodyObj: IId = req.params;
      await User.findByIdAndDelete(bodyObj.id);
      
      const response = new ApiResponse(200, {}, USER_DELETE_SUCCESS);
      res.status(CODE_200).json(response);
    }
  );

  static refreshToken = (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(new CustomError(ERR_UNAUTHORIZED, CODE_401));

    const user = User.findOne({ refreshToken });
    if (!user) return next(new CustomError(ERR_UNAUTHORIZED, CODE_401));

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET as string,
      (err: unknown, user: any) => {
        if (err) return next(new CustomError(ERR_UNAUTHORIZED, CODE_401));

        const accessToken = createJWTToken(user.email, user._id);
        const response = new ApiResponse(
          200,
          { accessToken },
          "Access token generated successfully"
        );
        res.status(CODE_200).json(response);
      }
    );
  };
}

export default UserController;
