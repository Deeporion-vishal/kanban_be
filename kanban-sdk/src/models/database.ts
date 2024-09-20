import { Types, Document } from "mongoose";

export enum Roles {
  Admin = "admin",
  Employee = "employee",
  Manager = "manager",
}

export enum Genders {
  Male = "male",
  Female = "female",
  Others = "others",
}

export interface IBoard extends Document {
  name: string;
  user: IUser;
  taskList: Types.ObjectId[];
  statusList: Status[];
}

export interface ITask extends Document {
  title: string;
  description: string;
  status: string;
  board: Types.ObjectId;
  subtaskList: Types.ObjectId[];
}

export interface ISubtask extends Document {
  title: string;
  isCompleted: boolean;
  task: Types.ObjectId;
}

export enum Status {
  ToDo = "todo",
  ReadyDev = "ready for dev",
  Inprogress = "inprogress",
  Intest = "intest",
  Completed = "completed",
  On_hold = "on_hold",
  Pending = "pending",
  In_review = "in_review",
  Cancelled = "cancelled",
  Reopend = "re-open",
  Closed = "closed",
  Done = "done",
  Blocked = "blocked",
  Backlog = "backlog",
  Unscheduled = "unscheduled",
}

interface IUserBasicInfo {
  firstName?: string;
  lastName?: string;
  username: string;
  password: string;
  confirmPassword?: string;
  dob?: Date;
  role?: Roles;
  gender?: Genders;
  profile?: string;
}

interface IUserSecurity {
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiration?: Date;
}

export interface IUser extends Document, IUserBasicInfo, IUserSecurity {
  id: Types.ObjectId;
  email: string;
  phone: string;
  boards: Types.ObjectId[];
  remember: boolean;
  refreshToken: String;
}

export interface IUserDB extends IUser {
  _doc: { [x: string]: any; password: any };
}

export interface IId {
  id?: string;
}

export interface IName {
  username: string;
}
