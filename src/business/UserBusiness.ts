import { UserDatabase } from "../database/UserDatabase"
import { DeleteUserByIdInputDTO, DeleteUserByIdOutputDTO } from "../dtos/User/deleteUserById.dto"
import { EditUserByIdInputDTO, EditUserByIdOutputDTO } from "../dtos/User/editUserById.dto"
import { GetUsersInputDTO, GetUsersOutputDTO } from "../dtos/User/getUsers.dto"
import { LoginInputDTO, LoginOutputDTO } from "../dtos/User/login.dto"
import { SignupInputDTO, SignupOutputDTO } from "../dtos/User/signup.dto"
import { BadRequestError } from "../errors/BadRequestError"
import { ConflictError } from "../errors/ConflictError"
import { ForbiddenError } from "../errors/ForbiddenError"
import { NotFoundError } from "../errors/NotFoundError"
import { UnauthorizedError } from "../errors/UnauthorizedError"
import { TokenPayload, USER_ROLES, User, UserDB, UserModel } from "../models/User"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export class UserBusiness {
  constructor (
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}

  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {

    const { username, email, password } = input

    const userEmailExist:UserDB | undefined = await this.userDatabase.getUserByEmail(email)

    if (userEmailExist){
        throw new ConflictError("Não deve é possível criar mais de uma conta com o mesmo e-mail. Tente novamente.")
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
    const token = this.tokenManager.createToken(tokenPayload)

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

    if(!users.length) throw new NotFoundError("Não há cadastro realizado no banco de dados.")

    const output: GetUsersOutputDTO = users

    return output as GetUsersOutputDTO

  }

  public editUserById = async (input: EditUserByIdInputDTO):Promise<EditUserByIdOutputDTO> => {

    const { id, username, email, password, token } = input

    const payload: TokenPayload | null = this.tokenManager.getPayload(token)

    if(!payload) {
      throw new UnauthorizedError()
    }

    if (payload.role !== USER_ROLES.ADMIN){
      if (payload.id !== id) {
        throw new ForbiddenError("Somente o próprio usuário ou um ADMIN pode editar a conta. Caso não tenha acesso a sua conta, entre em contato com nosso suporte.")
      }
    }
    
    const userDB: UserDB | undefined = await this.userDatabase.getUserById(id)
  
    if (!userDB) {
      throw new NotFoundError("Cadastro não encontrado.")
    }

    if (!username && !email && !password){
      throw new BadRequestError()
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
        throw new ForbiddenError("Somente o próprio usuário ou um ADMIN pode excluir a própria conta. Caso não tenha acesso a sua conta, entre em contato com nosso suporte.")
      }
    }

    const userDB: UserDB | undefined = await this.userDatabase.getUserById(id)
  
    if (!userDB) {
      throw new NotFoundError("Usuário não encontrado. Verifique o id e tente novamente.")
    }

    await this.userDatabase.deleteUserById(id)
  
    const output:DeleteUserByIdOutputDTO = {
      message: "Cadastro excluído com sucesso!",
    }

    return output as DeleteUserByIdOutputDTO
  }
    
}