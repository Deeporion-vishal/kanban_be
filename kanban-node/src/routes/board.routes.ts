import express from 'express'
import BoardController from '../controllers/board.controller';

const router = express.Router()

router.get('/users/user/:userId/boards',BoardController.getBoards)
router.post('/users/user/:userId/boards/board',BoardController.saveBoard)
router.delete('/boards/board/:boardId',BoardController.deleteBoard)
router.patch('/boards/board/:boardId',BoardController.updateBoard)
export default router;