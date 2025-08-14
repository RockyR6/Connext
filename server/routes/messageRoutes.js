import express from 'express'
import { upload } from '../config/multer.js'
import { protect } from '../middlewares/auth.js'
import { getChatmessages, sendMessage, sseController, getUserRecentMessages } from '../controllers/messageController.js'

const messageRouter = express.Router()

messageRouter.get('/:userId', sseController)
messageRouter.post('/send', upload.single('image'), protect, sendMessage)
messageRouter.post('/get', protect, getChatmessages)
messageRouter.get('/recent', protect, getUserRecentMessages)

export default messageRouter;