import express from 'express'
import { UserController } from '../controller/UserController'
import { UserBusiness } from '../business/UserBusiness'
import { UserDatabase } from '../database/UserDatabase'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'
import { HashManager } from '../services/HashManager'
import { PostDatabase } from '../database/PostDatabase'
import { CommentDatabase } from '../database/CommentDatabase'

export const userRouter = express.Router()

const userController = new UserController(
    new UserBusiness(
        new UserDatabase(),
        new PostDatabase(),
        new CommentDatabase(),
        new IdGenerator(),
        new TokenManager(),
        new HashManager()
    )
)

userRouter.post("/signup", userController.signup)
userRouter.post("/login", userController.login)
userRouter.get("/", userController.getUsers)
userRouter.get("/:id", userController.getUserById)
userRouter.get("/:id/posts/likes", userController.getLikesDislikesFromPostsByUserId)
userRouter.get("/:id/posts/:postId/comments/likes", userController.getLikesDislikesFromCommentsOnPostIdByUserId)
userRouter.put("/:id", userController.editUserById)
userRouter.delete("/:id", userController.deleteUserById)