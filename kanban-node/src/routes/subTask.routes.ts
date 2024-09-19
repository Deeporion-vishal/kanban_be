import express from 'express'
import SubTaskController from '../controllers/subTask.controller'

const router  = express.Router()

router.post('/tasks/task/:taskId/subtasks/subtask',SubTaskController.saveSubTask)
router.delete('/subtasks/subtask/:subtaskId',SubTaskController.deleteSubTask)
router.patch('/subtasks/subtask/:subtaskId',SubTaskController.updateSubTask)

export default router