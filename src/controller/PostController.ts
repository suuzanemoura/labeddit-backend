import { Request, Response } from "express"
import { ZodError } from "zod"
import { BaseError } from "../errors/BaseError"
import { PostBusiness } from "../business/PostBusiness"
import { GetPostsInputDTO, GetPostsOutputDTO, GetPostsSchema } from "../dtos/Post/getPosts.dto"
import { CreatePostInputDTO, CreatePostOutputDTO, CreatePostSchema } from "../dtos/Post/createPost.dto"
import { EditPostByIdInputDTO, EditPostByIdOutputDTO, EditPostByIdSchema } from "../dtos/Post/editPostById.dto"
import { DeletePostByIdInputDTO, DeletePostByIdOutputDTO, DeletePostByIdSchema } from "../dtos/Post/deletePostById.dto"
import { GetPostWithCommentsByIdInputDTO, GetPostWithCommentsByIdOutputDTO, GetPostWithCommentsByIdSchema } from "../dtos/Post/getPostWithCommentsById.dto"
import { LikeOrDislikePostInputDTO, LikeOrDislikePostOutputDTO, LikeOrDislikePostSchema } from "../dtos/Post/likeOrDislikePost.dto"


export class PostController{
  constructor(
      private postBusiness: PostBusiness
  ){}

  public createPost = async (req:Request, res: Response):Promise<void> => {
    try {
      const input:CreatePostInputDTO = CreatePostSchema.parse({
        content: req.body.content,
        token: req.headers.authorization
      })

      const output:CreatePostOutputDTO = await this.postBusiness.createPost(input)
      res.status(201).send(output)

    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(`${error.issues[0].path[0]}: ${error.issues[0].message}`)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado.")
      }
    }
  }

  public getPosts = async (req:Request, res: Response):Promise<void> => {

    try {
      const input:GetPostsInputDTO = GetPostsSchema.parse({
          query: req.query.q,
          token: req.headers.authorization
      })

      const output:GetPostsOutputDTO = await this.postBusiness.getPosts(input)
      res.status(200).send(output)
        
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(`${error.issues[0].path[0]}: ${error.issues[0].message}`)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado.")
      }
    }
  }

  public getPostWithCommentsById = async (req:Request, res: Response):Promise<void> => {

    try {
      const input:GetPostWithCommentsByIdInputDTO = GetPostWithCommentsByIdSchema.parse({
          postId: req.params.postId,
          token: req.headers.authorization
      })

      const output:GetPostWithCommentsByIdOutputDTO = await this.postBusiness.getPostWithCommentsById(input)
      res.status(200).send(output)
        
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(`${error.issues[0].path[0]}: ${error.issues[0].message}`)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado.")
      }
    }
  }

  public editPostById = async (req:Request, res: Response):Promise<void> => {
    try {
      const input:EditPostByIdInputDTO = EditPostByIdSchema.parse({
          postId: req.params.postId,
          content: req.body.content,
          token: req.headers.authorization
      })

      const output:EditPostByIdOutputDTO = await this.postBusiness.editPostById(input)
      res.status(200).send(output)

    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(`${error.issues[0].path[0]}: ${error.issues[0].message}`)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado.")
      }
    }
  }

  public deletePostById = async (req: Request, res: Response):Promise<void> => {
    try {
      const input:DeletePostByIdInputDTO = DeletePostByIdSchema.parse({
        postId: req.params.postId,
        token: req.headers.authorization
      })

      const output:DeletePostByIdOutputDTO = await this.postBusiness.deletePostById(input)
      res.status(200).send(output)

    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(`${error.issues[0].path[0]}: ${error.issues[0].message}`)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado.")
      }
    }
  }

  public likeOrDislikePost = async (req: Request, res: Response):Promise<void> => {
    try {
      const input:LikeOrDislikePostInputDTO = LikeOrDislikePostSchema.parse({
        postId: req.params.postId,
        token: req.headers.authorization,
        like: req.body.like
      })

      const output:LikeOrDislikePostOutputDTO = await this.postBusiness.likeOrDislikePost(input)
      res.status(200).send(output)

    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(`${error.issues[0].path[0]}: ${error.issues[0].message}`)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado.")
      }
    }
  }
}