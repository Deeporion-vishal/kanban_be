import { Request, Response, NextFunction } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import Task from "../models/task.model";
import Board from "../models/board.model";
import CustomError from "../utils/CustomError";
import { Types } from "mongoose";
import { RequestHandler } from "express";
import {
  ISaveTaskBody,
  ISubtask,
  ITask,
  ITaskUpdateReq,
} from "@kanban/sdk/bin/link";
import SubTask from "../models/subtask.model";
import {
  BOARD_NOT_FOUND,
  CODE_200,
  CODE_404,
  SUBTASK_UPDATE_SUCCESS,
  TASK_DELETE_SUCCESS,
  Task_NOT_FOUND,
  TASK_UPDATE_SUCCESS,
} from "../utils/translations";

class TaskController {
  static saveTask: RequestHandler<{ boardId: string }, {}, ISaveTaskBody> =
    asyncErrorHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        const { boardId } = req.params;
        const board = await Board.findById(boardId);
        if (!board) return next(new CustomError("board not found", 404));
        const bodyObj = req.body as ISaveTaskBody;
        const { subtaskList, ...restObj } = bodyObj;
        const task = await Task.create({ ...restObj, board: boardId });
        board.taskList.push(task._id as Types.ObjectId);
        await board.save();
        for (const subtask of subtaskList) {
          const subTask = await SubTask.create({
            title: subtask.title,
            isCompleted: subtask.isCompleted,
            task: task._id,
          });
          task.subtaskList.push(subTask._id as Types.ObjectId);
          await task.save();
        }
        res.status(200).json({
          success: true,
          task,
        });
      }
    );

  static updateTask: RequestHandler<{ taskId: string }, {}, ITaskUpdateReq> =
    asyncErrorHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        const { taskId } = req.params;

        const task = (await Task.findById(taskId)) as ITask;

        if (!task) return next(new CustomError("task not found", 404));
        const bodyObj: ITaskUpdateReq = req.body;
        const { subtaskList, ...restObj } = bodyObj;
        await Task.findByIdAndUpdate(taskId, { ...restObj });
        if (subtaskList?.length > 0) {
          for (const subtask of subtaskList) {
            await SubTask.findByIdAndUpdate(subtask._id, {
              title: subtask.title,
              isCompleted: subtask.isCompleted,
            });
          }
        }

        res.status(CODE_200).json({ success: true, TASK_UPDATE_SUCCESS });
      }
    );
  static deleteTask: RequestHandler<{ taskId: string }, {}, {}> =
    asyncErrorHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        const { taskId } = req.params;
        const task = (await Task.findById(taskId)) as ITask;
        if (!task) return next(new CustomError(Task_NOT_FOUND, CODE_404));
        const board = await Board.findById(task.board);
        if (!board) return next(new CustomError(BOARD_NOT_FOUND, CODE_404));
        board.taskList = board.taskList.filter((task) => task.toString() !== taskId);
        await SubTask.deleteMany({ task: taskId });
        await Task.findByIdAndDelete(taskId);
        await board.save();
        res
          .status(CODE_200)
          .json({ success: true, message: TASK_DELETE_SUCCESS });
      }
    );
}

export default TaskController;
