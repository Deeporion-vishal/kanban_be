import mongoose, { model, Schema } from "mongoose";
import { ISubtask } from "@kanban/sdk/bin/link/api";

const subTaskSchema = new mongoose.Schema<ISubtask>(
  {
    title: {
      type: String,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubTask = model<ISubtask>("SubTask", subTaskSchema);

export default SubTask;
