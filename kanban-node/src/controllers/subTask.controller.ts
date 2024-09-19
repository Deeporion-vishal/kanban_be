import { Request, Response, NextFunction,RequestHandler} from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import Task from "../models/task.model";
import CustomError from "../utils/CustomError";
import SubTask from "../models/subtask.model";
import { ISubtask, ISubTaskRequest, ISubTaskUpdateReq, ITask,} from "@kanban/sdk/bin/link";
import { Types } from "mongoose";
import { CODE_200, CODE_404, SUBTASK_DELETE_SUCCESS, SUBTASK_NOT_FOUND, SUBTASK_UPDATE_SUCCESS, Task_NOT_FOUND } from "../utils/translations";

class SubTaskController{
    static saveSubTask:RequestHandler<{taskId:string}, {}, ISubTaskRequest> = asyncErrorHandler(
        async(req:Request,res:Response,next:NextFunction)=>{
            const {taskId} = req.params
            const {title, isCompleted} = req.body
            const task = await Task.findById(taskId)
            if(!task) return next(new CustomError(Task_NOT_FOUND,CODE_404))
            const subTask = await SubTask.create({title,isCompleted,task:taskId})
            task.subtaskList.push(subTask._id as Types.ObjectId)
            await task.save()
            res.status(CODE_200).json({
                success : true,
                subTask
            })
        }
    )
    static updateSubTask: RequestHandler<{ subtaskId: string }, {}, ISubTaskUpdateReq> =
    asyncErrorHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        const { subtaskId } = req.params;
        const bodyObj:ISubTaskUpdateReq=req.body;
        await SubTask.findByIdAndUpdate(subtaskId,bodyObj) as ISubtask;
        res.status(CODE_200).json({ success: true, message:SUBTASK_UPDATE_SUCCESS });

      }
    );
    static deleteSubTask:RequestHandler<{subtaskId:string}, {}, {}> = asyncErrorHandler(
        async(req:Request,res:Response,next:NextFunction)=>{
            const {subtaskId} = req.params
            const subTask = await SubTask.findById(subtaskId) as ISubtask
            if(!subTask) return next(new CustomError(SUBTASK_NOT_FOUND,CODE_404))
            const task = await Task.findById(subTask.task) as ITask
            if(!task) return next(new CustomError(Task_NOT_FOUND,CODE_404))
            task.subtaskList = task.subtaskList.filter((id)=>id.toString() !== subtaskId)
            await task.save()
            await SubTask.findByIdAndDelete(subtaskId)
            res.status(CODE_200).json({
                success : true,
                message : SUBTASK_DELETE_SUCCESS
            })
        }
    )
}

export default SubTaskController