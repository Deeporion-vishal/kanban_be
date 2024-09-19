import mongoose, { Types } from "mongoose";
import { PROFILE_DEF_IMG } from "../utils/translations";
import { Genders, IUser, Roles } from "@kanban/sdk/bin/link/models/database";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String
    },
    phone: {
      type: String,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: Genders,
      default: Genders.Others,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: Roles,
      default: Roles.Customer,
    },
    profile: {
      type: String,
      default: PROFILE_DEF_IMG,
    },
    boards: [
      {
        type: Types.ObjectId,
        ref: "Board",
      },
    ],
    remember:{
      type :Boolean ,
      default:false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiration: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
