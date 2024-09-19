import mongoose, { model, Types } from "mongoose";
import {IBoard} from '@kanban/sdk/bin/link/api'
import { Status } from "@kanban/sdk/bin/link/models/database";

const boardSchema = new mongoose.Schema<IBoard>(
  {
    user: {
      type: Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
    },
    statusList: {
      type: [String],
      enum: Status,
      lowercase : true
    },
    taskList: [
      {
        type: Types.ObjectId,
        ref:"Task"
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Board = model<IBoard>('Board',boardSchema)

export default Board;