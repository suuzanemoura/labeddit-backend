import { CommentDatabase } from "../database/CommentDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { DeleteUserByIdInputDTO, DeleteUserByIdOutputDTO } from "../dtos/User/deleteUserById.dto"
import { EditUserByIdInputDTO, EditUserByIdOutputDTO } from "../dtos/User/editUserById.dto"
import { GetUsersInputDTO, GetUsersOutputDTO } from "../dtos/User/getUsers.dto"
import { LoginInputDTO, LoginOutputDTO } from "../dtos/User/login.dto"
import { SignupInputDTO, SignupOutputDTO } from "../dtos/User/signup.dto"
import { CommentDB } from "../models/Comment"
import { Comment, CommentWithCreatorDB, LikeDislikeCommentDB } from "../models/Comment"
import { LikeDislikePostDB, Post, PostDB, PostWithCreatorDB } from "../models/Post"
import { TokenPayload, USER_ROLES, User, UserDB, UserModel } from "../models/User"
import { BadRequestError } from "../errors/BadRequestError"
import { ConflictError } from "../errors/ConflictError"
import { ForbiddenError } from "../errors/ForbiddenError"
import { NotFoundError } from "../errors/NotFoundError"
import { UnauthorizedError } from "../errors/UnauthorizedError"
import { GetUserByIdInputDTO, GetUserByIdOutputDTO } from "../dtos/User/getUserById.dto"


export class UserBusiness {
  constructor (
    private userDatabase: UserDatabase,
    private postsDatabase: PostDatabase,
    private commentDatabase: CommentDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}

  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {

    const { username, email, password } = input

    const usernameExist:UserDB | undefined = await this.userDatabase.getUserByUsername(username)

    if (usernameExist){
      throw new ConflictError("Não é possível criar mais de uma conta com o mesmo username. Tente novamente.")
    }

    const userEmailExist:UserDB | undefined = await this.userDatabase.getUserByEmail(email)

    if (userEmailExist){
        throw new ConflictError("Não é possível criar mais de uma conta com o mesmo e-mail. Tente novamente.")
    }

    const id:string = this.idGenerator.generate()
    const hashedPassword:string = await this.hashManager.hash(password)

    const newUser = new User(
      id,
      username,
      email,
      hashedPassword,
      USER_ROLES.NORMAL,
      new Date().toISOString()
    )
  
    const newUserDB:UserDB = newUser.toDBModel()
    await this.userDatabase.insertUser(newUserDB)

    const tokenPayload: TokenPayload = newUser.toTokenPayload()
    const token = this.tokenManager.createToken(tokenPayload)

    const output: SignupOutputDTO = {
      message: "Cadastro realizado com sucesso!",
      token: token
    }
  
    return output as SignupOutputDTO
  }

  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {

    const { email, password } = input

    const userDB:UserDB | undefined = await this.userDatabase.getUserByEmail(email)

    if (!userDB){
        throw new BadRequestError("'Email' ou 'Password' incorretos. Tente novamente.")
    }

    const hashedPassword:string = userDB.password
    const isPasswordCorrect:boolean = await this.hashManager.compare(password, hashedPassword)

    if (!isPasswordCorrect) {
      throw new BadRequestError("'Email' ou 'Password' incorretos. Tente novamente.")
    }

    const user = new User(
      userDB.id,
      userDB.username,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    )

    const tokenPayload: TokenPayload = user.toTokenPayload()
    const token:string = this.tokenManager.createToken(tokenPayload)

    const output: LoginOutputDTO = {
      message: "Login realizado com sucesso!",
      token: token
    }

    return output as LoginOutputDTO
  }

  public getUsers = async (input: GetUsersInputDTO):Promise<GetUsersOutputDTO> => {

    const { query, token } = input

    const payload: TokenPayload | null = this.tokenManager.getPayload(token)

    if(!payload) {
      throw new UnauthorizedError()
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      throw new ForbiddenError("Somente ADMINS podem acessar esse recurso.")
    }

    const usersDB: UserDB[] = await this.userDatabase.getUsers(query)
  
    const users:UserModel[] = usersDB.map((userDB) => { 
        const user = new User(
        userDB.id,
        userDB.username,
        userDB.email,
        userDB.password,
        userDB.role,
        userDB.created_at,    
    )
      return user.toBusinessModel()
    })

    const output: GetUsersOutputDTO = users

    return output as GetUsersOutputDTO

  }

  public getUserById = async (input: GetUserByIdInputDTO):Promise<GetUserByIdOutputDTO> => {

    const { id, token } = input

    const payload: TokenPayload | null = this.tokenManager.getPayload(token)

    if(!payload) {
      throw new UnauthorizedError()
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== id) {
        throw new ForbiddenError("Somente o próprio usuário ou um ADMIN podem ter acesso às suas informações. Caso não tenha acesso a sua conta, entre em contato com nosso suporte.")
      }
    }

    const userDB: UserDB | undefined = await this.userDatabase.getUserById(id)

    if (!userDB){
      throw new NotFoundError("Cadastro não encontrado. Verifique o id e tente novamente.")
    }
  
    const user = new User(
      userDB.id,
      userDB.username,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at,    
    )

    const output:GetUserByIdOutputDTO = user.toBusinessModel()

    return output as GetUserByIdOutputDTO

  }

  public editUserById = async (input: EditUserByIdInputDTO):Promise<EditUserByIdOutputDTO> => {

    const { id, username, email, password, token } = input

    const payload: TokenPayload | null = this.tokenManager.getPayload(token)

    if(!payload) {
      throw new UnauthorizedError()
    }

    if (payload.role !== USER_ROLES.ADMIN){
      if (payload.id !== id) {
        throw new ForbiddenError("Somente o próprio usuário ou um ADMIN podem editar a conta. Caso não tenha acesso a sua conta, entre em contato com nosso suporte.")
      }
    }
    
    const userDB: UserDB | undefined = await this.userDatabase.getUserById(id)
  
    if (!userDB) {
      throw new NotFoundError("Cadastro não encontrado. Verifique o id e tente novamente.")
    }

    if (!username && !email && !password){
      throw new BadRequestError()
    }

    if(username){
      const usernameExist:UserDB | undefined = await this.userDatabase.getUserByUsername(username)

      if (usernameExist){
        throw new ConflictError("Esse username já está em uso, tente novamente com outro username.")
      }
    }

    if(email){
      const userEmailExist:UserDB | undefined = await this.userDatabase.getUserByEmail(email)

      if(userEmailExist){
        throw new ConflictError("Não é possível usar o mesmo email em mais de uma conta.")
      }
    }

    const user = new User(
      userDB.id,
      userDB.username,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    )
    
    let hashedPassword:string | undefined

    if (password){
      hashedPassword = await this.hashManager.hash(password)
    }

    user.USERNAME = username || userDB.username
    user.EMAIL = email || userDB.email
    user.PASSWORD = hashedPassword || userDB.password

    const updatedUserDB:UserDB = user.toDBModel()
    await this.userDatabase.editUserById(updatedUserDB)
  
    const output:EditUserByIdOutputDTO = {
      message: "Cadastro atualizado com sucesso!",
    }

    return output as EditUserByIdOutputDTO
  }

  public deleteUserById = async (input: DeleteUserByIdInputDTO):Promise<DeleteUserByIdOutputDTO> => {

    const { id, token } = input

    const payload: TokenPayload | null = this.tokenManager.getPayload(token)

    if(!payload) {
      throw new UnauthorizedError()
    }

    if (payload.role !== USER_ROLES.ADMIN){
      if (payload.id !== id) {
        throw new ForbiddenError("Somente o próprio usuário ou um ADMIN podem excluir a conta. Caso não tenha acesso a sua conta, entre em contato com nosso suporte.")
      }
    }

    const userDB: UserDB | undefined = await this.userDatabase.getUserById(id)
  
    if (!userDB) {
      throw new NotFoundError("Cadastro não encontrado. Verifique o id e tente novamente.")
    }

    const likeOrDislikeOnPostsExists: LikeDislikePostDB[] = await this.postsDatabase.getLikeDislikeFromPostByUserId(id)

    if (likeOrDislikeOnPostsExists.length){

      likeOrDislikeOnPostsExists.map(async (likeOrDislikeOnPostDB) => {

        const postDB:PostWithCreatorDB | undefined = await this.postsDatabase.getPostWithCreatorById(likeOrDislikeOnPostDB.post_id)

        if (postDB){

          const post = new Post(
            postDB.id,
            postDB.content,
            postDB.comments,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            postDB.creator_id,
            postDB.creator_username
          )
  
          likeOrDislikeOnPostDB.like === 1 ? post.removeLike() : post.removeDislike()
  
          const updatedPostDB:PostDB = post.toDBModel()
  
          await this.postsDatabase.updatePostById(updatedPostDB)

        }
        
      })

    }

    const likeOrDislikeOnCommentsExists:LikeDislikeCommentDB[] = await this.commentDatabase.getLikeDislikeFromCommentByUserId(id)

    if(likeOrDislikeOnCommentsExists.length){

      likeOrDislikeOnCommentsExists.map(async (likeOrDislikeOnCommentDB) => { 

        const commentDB:CommentWithCreatorDB | undefined = await this.commentDatabase.getCommentWithCreatorById(likeOrDislikeOnCommentDB.comment_id)

        if (commentDB){

          const comment = new Comment(
            commentDB.id,
            commentDB.post_id,
            commentDB.content,
            commentDB.likes,
            commentDB.dislikes,
            commentDB.created_at,
            commentDB.updated_at,
            commentDB.creator_id,
            commentDB.creator_username
          )
          
          likeOrDislikeOnCommentDB.like === 1 ? comment.removeLike() : comment.removeDislike()
          
          const updatedCommentDB:CommentDB = comment.toDBModel()
          await this.commentDatabase.updateCommentById(updatedCommentDB)

        }

      })

    }

    await this.userDatabase.deleteUserById(id)
  
    const output:DeleteUserByIdOutputDTO = {
      message: "Cadastro excluído com sucesso!",
    }

    return output as DeleteUserByIdOutputDTO
  }
    
}