import { Request, Response, NextFunction, RequestHandler } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import User from "../models/user.model";
import CustomError from "../utils/CustomError";
import Board from "../models/board.model";
import { IBoard, IBoardUpdatereq, IUser } from "@kanban/sdk/bin/link";
import { IBoardRequest } from "@kanban/sdk/bin/link/api";
import { Types } from "mongoose";
import Task from "../models/task.model";
import SubTask from "../models/subtask.model";
import {
  BOARD,
  BOARD_DELETE_SUCCESS,
  BOARD_NOT_FOUND,
  CODE_200,
  CODE_404,
  SUB_TASK_LIST,
  TASK_LIST,
  USER_NOT_FOUND,
} from "../utils/translations";

class BoardController {
  static getBoards: RequestHandler<{ userId: string }, {}, {}> =
    asyncErrorHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        const user = await User.findById(userId).populate({
          path: BOARD,
          populate: { path: TASK_LIST, populate: { path: SUB_TASK_LIST } },
        });
        if (!user) return next(new CustomError(USER_NOT_FOUND, CODE_404));
        res.status(CODE_200).json({
          success: true,
          board: user.boards,
        });
      }
    );
  static saveBoard: RequestHandler<{ userId: string }, {}, IBoardRequest> =
    asyncErrorHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        const { name, statusList } = req.body;
        const user = (await User.findById(userId)) as IUser;
        if (!user) return next(new CustomError(USER_NOT_FOUND, CODE_404));
        const board = (await Board.create({
          name,
          statusList,
          user: user._id,
        })) as IBoard;
        user.boards.push(board._id as Types.ObjectId);
        await user.save();
        res.status(CODE_200).json({
          success: true,
          board: board,
        });
      }
    );

  static updateBoard: RequestHandler<{ boardId: string }, {}, IBoardUpdatereq> =
    asyncErrorHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        const { boardId } = req.params;
        const bodyObj:IBoardUpdatereq=req.body;
        await Board.findByIdAndUpdate(boardId,bodyObj) as IBoard;
        const board=await Board.findById(boardId) as IBoard;
        res.status(CODE_200).json({ success: true, board });

      }
    );
  static deleteBoard: RequestHandler<{ boardId: string }, {}, {}> =
    asyncErrorHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        const { boardId } = req.params;
        const board = (await Board.findById(boardId).populate({
          path: TASK_LIST,
          populate: { path: SUB_TASK_LIST },
        })) as IBoard;
        if (!board) return next(new CustomError(BOARD_NOT_FOUND, CODE_404));
        const user = await User.findById(board.user);
        if (!user) return next(new CustomError(BOARD_NOT_FOUND, CODE_404));
        user.boards = user.boards.filter(
          (userBoardId) => userBoardId.toString() !== boardId
        );
        await user.save();
        for (const task of board.taskList) {
          await SubTask.deleteMany({ task: { $in: task._id } });
        }
        await Task.deleteMany({ board: boardId });
        await Board.findByIdAndDelete(boardId);
        res.status(CODE_200).json({
          success: true,
          message: BOARD_DELETE_SUCCESS,
        });
      }
    );
}

export default BoardController;
