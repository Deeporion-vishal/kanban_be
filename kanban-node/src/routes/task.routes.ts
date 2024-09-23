import express from "express";
import TaskController from "../controllers/task.controller";

const router = express.Router()

router.post('/boards/board/:boardId/tasks/task',TaskController.saveTask)
router.delete('/tasks/task/:taskId',TaskController.deleteTask)
router.patch('/tasks/task/:taskId',TaskController.updateTask)
export default router