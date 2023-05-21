import express from 'express'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'
import { PostController } from '../controller/PostController'
import { PostBusiness } from '../business/PostBusiness'
import { PostDatabase } from '../database/PostDatabase'
import { CommentDatabase } from '../database/CommentDatabase'

export const postRouter = express.Router()

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
)

postRouter.post("/", postController.createPost)
postRouter.get("/", postController.getPosts)
postRouter.get("/:postId", postController.getPostWithCommentsById)
postRouter.put("/:postId", postController.editPostById)
postRouter.put("/:postId/like", postController.likeOrDislikePost)
postRouter.delete("/:postId", postController.deletePostById)