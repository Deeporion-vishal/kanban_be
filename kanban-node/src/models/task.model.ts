import mongoose, { model, Schema, Types} from "mongoose";
import { ITask } from "@kanban/sdk/bin/link/api";

const taskSchema = new mongoose.Schema<ITask>(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      lowercase:true
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required : true
    },
    subtaskList: [
      {
        type: Types.ObjectId,
        ref: "SubTask",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Task = model<ITask>("Task", taskSchema);

export default Task;
