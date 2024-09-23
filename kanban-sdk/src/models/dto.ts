import { ObjectId, Types } from "mongoose";
import { Genders, IBoard, ISubtask, ITask, IUser, Status } from "./database";

export interface UserIdParams {
  userId: string;
}
export interface BoardIdParams {
  boardId: string;
}
export interface IBoardRequest {
  name: string;
  statusList: Status[];
}

export interface IBoardResponse {
  success: boolean;
  board: {
    id: string;
    name: string;
    taskList: ITask[];
    statusList: Status[];
  };
}
export interface IBoardUpdatereq{

  name?:string;
  statusList?: Status[];

}

export interface ISubTaskRequest {
  title: string;
  isCompleted: boolean;
}
export interface ISubTaskUpdateReq {
  title: string;
  isCompleted: boolean;
}

export interface ISaveTaskBody{
  title: string;
  description: string;
  status: string;
  subtaskList : ISubtask[]
};

export interface ISubtaskResponse {
  id: string;
  title: string;
  task: string;
  isCompleted: boolean;
}

export interface ITaskRequest {
  title: string;
  description: string;
  status: string;
}
export interface ITaskUpdateReq {
  title?: string;
  description?: string;
  status?: string;
  subtaskList: ISubtask[];
}
export interface ITaskResponse {
  success: boolean;
  task:ITask[],
  
}

export interface IUserRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

//TODO
export interface IUserResponse {
  success?: boolean;
  users: {
    id: Types.ObjectId;
    firstName: string;
    lastName: string;
    username: string;
    boards: IBoard[];
  }[];
}

export interface ISuccessResponse {
  success: boolean;
  message?: string;
  user?: {
    id: ObjectId | unknown;
    username: string | unknown;
    gender?: Genders | unknown;
    email: string | unknown;
    role?: string | unknown;
    profile?: string | unknown;
  };
}

export interface IUserSignIn {
  email: string;
  password: string;
}

export interface ISignInResponse {
  success?: boolean;
  user: {
    id: ObjectId | unknown;
    username: string | unknown;
    email: string | unknown;
    token: string | unknown;
  };
}

export interface IGetAllUsersQueryParams {
  username?: string;
  email?: string;
  page?: number;
  limit?: number;
}

export interface IUserUpdate {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  dob?: Date;
  gender?: Genders;
  profile?: string;
}

