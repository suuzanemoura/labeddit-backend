import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { GetUsersInputDTO, GetUsersOutputDTO, GetUsersSchema } from "../dtos/User/getUsers.dto"
import { ZodError } from "zod"
import { BaseError } from "../errors/BaseError"
import { SignupInputDTO, SignupOutputDTO, SignupSchema } from "../dtos/User/signup.dto"
import { LoginInputDTO, LoginOutputDTO, LoginSchema } from "../dtos/User/login.dto"
import { DeleteUserByIdInputDTO, DeleteUserByIdOutputDTO, DeleteUserByIdSchema } from "../dtos/User/deleteUserById.dto"
import { EditUserByIdInputDTO, EditUserByIdOutputDTO, EditUserByIdSchema } from "../dtos/User/editUserById.dto"
import { GetUserByIdInputDTO, GetUserByIdOutputDTO, GetUserByIdSchema } from "../dtos/User/getUserById.dto"

export class UserController{
  constructor(
      private userBusiness: UserBusiness
  ){}

  public signup = async (req: Request, res: Response):Promise<void> => {
      try {
        const input:SignupInputDTO = SignupSchema.parse({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password
        })
  
        const output:SignupOutputDTO = await this.userBusiness.signup(input)
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

  public login = async (req: Request, res: Response):Promise<void> => {
    try {
      const input:LoginInputDTO = LoginSchema.parse({
        email: req.body.email,
        password: req.body.password
      })

      const output:LoginOutputDTO = await this.userBusiness.login(input)
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

  public getUsers = async (req:Request, res: Response):Promise<void> => {

    try {
        const input:GetUsersInputDTO = GetUsersSchema.parse({
            query: req.query.q,
            token: req.headers.authorization
        })

        const output:GetUsersOutputDTO = await this.userBusiness.getUsers(input)
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

  public getUserById = async (req:Request, res: Response):Promise<void> => {

    try {
        const input:GetUserByIdInputDTO = GetUserByIdSchema.parse({
            id: req.params.id,
            token: req.headers.authorization
        })

        const output:GetUserByIdOutputDTO = await this.userBusiness.getUserById(input)
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

  public editUserById = async (req: Request, res: Response):Promise<void> => {
    try {
      const input:EditUserByIdInputDTO = EditUserByIdSchema.parse({
        id: req.params.id,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        token: req.headers.authorization
      })

      const output:EditUserByIdOutputDTO = await this.userBusiness.editUserById(input)
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
    
  public deleteUserById = async (req: Request, res: Response):Promise<void> => {
    try {
      const input:DeleteUserByIdInputDTO = DeleteUserByIdSchema.parse({
        id: req.params.id,
        token: req.headers.authorization
      })

      const output:DeleteUserByIdOutputDTO = await this.userBusiness.deleteUserById(input)
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