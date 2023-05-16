import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { CreateCommentInputDTO, CreateCommentOutputDTO } from "../dtos/Comment/createComment.dto";
import { DeleteCommentByIdInputDTO, DeleteCommentByIdOutputDTO } from "../dtos/Comment/deleteCommentById.dto";
import { EditCommentByIdInputDTO, EditCommentByIdOutputDTO } from "../dtos/Comment/editComment.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Comment, CommentDB } from "../models/Comment";
import { PostDB } from "../models/Post";
import { TokenPayload, USER_ROLES } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class CommentBusiness {
    constructor (
      private commentDatabase: CommentDatabase,
      private postDatabase: PostDatabase,
      private idGenerator: IdGenerator,
      private tokenManager: TokenManager
    ) {}

    public createComment = async (input: CreateCommentInputDTO): Promise<CreateCommentOutputDTO> => {

        const { postId, content, token } = input

        const payload: TokenPayload | null = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new UnauthorizedError()
        }

        const postDB: PostDB | undefined = await this.postDatabase.getPostById(postId)

        if (!postDB){
            throw new NotFoundError("Post não encontrado. Verifique a id e tente novamente.")
        }

        const id:string = this.idGenerator.generate()

        const newComment = new Comment (
            id,
            postId,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.username
        )

        const newCommentDB:CommentDB = newComment.toDBModel()
        await this.commentDatabase.insertComment(newCommentDB)

        const output: CreateCommentOutputDTO = {
            message: "Comentário criado com sucesso!"
        }
      
        return output as CreateCommentOutputDTO
    }

    public editCommentById = async (input: EditCommentByIdInputDTO): Promise<EditCommentByIdOutputDTO> => {
        const { postId, commentId, content, token } = input

        const payload: TokenPayload | null = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new UnauthorizedError()
        }

        const postDB: PostDB | undefined = await this.postDatabase.getPostById(postId)
    
        if (!postDB) {
            throw new NotFoundError("Post não encontrado. Verifique a id e tente novamente.")
        }

        const commentDB: CommentDB | undefined = await this.commentDatabase.getCommentsById(commentId)

        if (payload.role !== USER_ROLES.ADMIN){
            if (payload.id !== commentDB.creator_id) {
              throw new ForbiddenError("Somente o criador do comentário pode editá-lo. Caso não tenha acesso a sua conta, entre em contato com nosso suporte.")
            }
        }
    
        const comment = new Comment(
            commentDB.id,
            commentDB.post_id,
            commentDB.content,
            commentDB.likes,
            commentDB.dislikes,
            commentDB.created_at,
            commentDB.updated_at,
            commentDB.creator_id,
            payload.username
        )

        comment.CONTENT = content
        comment.UPDATED_AT = new Date().toISOString()

        const updatedCommentDB:CommentDB = comment.toDBModel()
        await this.commentDatabase.updateCommentById(updatedCommentDB)
    
        const output:EditCommentByIdOutputDTO = {
            message: "Comentário atualizado com sucesso!",
        }

        return output
    }

    public deleteCommentById = async (input: DeleteCommentByIdInputDTO):Promise<DeleteCommentByIdOutputDTO> => {

        const { commentId, token } = input
    
        const payload: TokenPayload | null = this.tokenManager.getPayload(token)
    
        if(!payload) {
          throw new UnauthorizedError()
        }

        const commentDB: CommentDB | undefined = await this.commentDatabase.getCommentsById(commentId)

        if (!commentDB) {
            throw new NotFoundError("Comentário não encontrado. Verifique o id e tente novamente.")
        }

        const postDB: PostDB | undefined = await this.postDatabase.getPostById(commentDB.post_id)

        if (!postDB) {
            throw new NotFoundError("Post não encontrado. Verifique se o post não foi excluída pelo seu autor e tente novamente.")
        }
    
        if (payload.role !== USER_ROLES.ADMIN){
          if (payload.id !== commentDB.creator_id || payload.id !== postDB?.creator_id) {
            throw new ForbiddenError("Somente o autor do comentário, o autor do post ou um ADMIN pode excluir o comentário. Caso não tenha acesso a sua conta, entre em contato com nosso suporte.")
          }
        }
      
        await this.commentDatabase.deleteCommentById(commentId)
      
        const output:DeleteCommentByIdOutputDTO = {
          message: "Comentário excluído com sucesso!",
        }
    
        return output as DeleteCommentByIdOutputDTO
      }

}