import express from 'express'
import { upload } from '../config/multer.js'
import { protect } from '../middlewares/auth.js'
import { addUserStory, getStories } from '../controllers/storyController.js'

const storyRouter = express.Router()

// auth → upload → controller
storyRouter.post('/create', protect, upload.single('media'), addUserStory)
storyRouter.get('/get', protect, getStories)

export default storyRouter;
