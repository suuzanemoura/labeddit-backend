import { PostDatabase } from "../database/PostDatabase"
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/Post/createPost.dto"
import { DeletePostByIdInputDTO, DeletePostByIdOutputDTO } from "../dtos/Post/deletePostById.dto"
import { EditPostByIdInputDTO, EditPostByIdOutputDTO } from "../dtos/Post/editPostById.dto"
import { GetPostWithCommentByIdInputDTO, GetPostWithCommentByIdOutputDTO } from "../dtos/Post/getPostWithCommentsById.dto"
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/Post/getPosts.dto"
import { ForbiddenError } from "../errors/ForbiddenError"
import { NotFoundError } from "../errors/NotFoundError"
import { UnauthorizedError } from "../errors/UnauthorizedError"
import { Comment, CommentModel } from "../models/Comment"
import { Post, PostDB, PostModel, PostWithCommentsDB, PostWithCommentsModel, PostWithCreatorDB } from "../models/Post"
import { TokenPayload, USER_ROLES } from "../models/User"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export class PostBusiness {
    constructor (
    private postsDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
    ) {}

    public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {

        const { content, token } = input

        const payload: TokenPayload | null = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new UnauthorizedError()
        }

        const id:string = this.idGenerator.generate()

        const newPost = new Post (
            id,
            content,
            0,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.username,
            []
        )

        const newPostDB:PostDB = newPost.toDBModel()
        await this.postsDatabase.insertPost(newPostDB)

        const output: CreatePostOutputDTO = {
            message: "Post criado com sucesso!"
        }
      
        return output as CreatePostOutputDTO
    }

    public getPosts = async (input: GetPostsInputDTO):Promise<GetPostsOutputDTO> => {

        const { query, token } = input

        const payload: TokenPayload | null = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new UnauthorizedError()
        }

        const postsDB:PostWithCreatorDB[] = await this.postsDatabase.getPostsWithCreator(query)
        
        const posts:PostModel[] = postsDB.map((postDB) => { 

            const post = new Post(
                postDB.id,
                postDB.content,
                postDB.comments,
                postDB.likes,
                postDB.dislikes,
                postDB.created_at,
                postDB.updated_at,
                postDB.creator_id,
                postDB.creator_username,
                []
            )

            return post.toBusinessModel()

        })

        if(!posts.length){
            throw new NotFoundError("Nenhum post foi encontrado.")
        }
    
        const output: GetPostsOutputDTO = posts
        return output as GetPostsOutputDTO
    }

    public getPostWithCommentsById = async (input: GetPostWithCommentByIdInputDTO):Promise<GetPostWithCommentByIdOutputDTO> => {

        const { postId, token } = input

        const payload: TokenPayload | null = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new UnauthorizedError()
        }

        const postWithCommentsDB:PostWithCommentsDB = await this.postsDatabase.getPostWithCreatorAndCommentsById(postId)

        if(!postWithCommentsDB){
            throw new NotFoundError("Nenhum post foi encontrado. Verifique a id e tente novamente.")
        }

        const commentsInPost:CommentModel[] = postWithCommentsDB.comments_post.map((commentDB) => { 

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

            return comment.toBusinessModel()

        })
        
        const post = new Post(
            postWithCommentsDB.id,
            postWithCommentsDB.content,
            postWithCommentsDB.comments,
            postWithCommentsDB.likes,
            postWithCommentsDB.dislikes,
            postWithCommentsDB.created_at,
            postWithCommentsDB.updated_at,
            postWithCommentsDB.creator.id,
            postWithCommentsDB.creator.username,
            commentsInPost
        )
        
        const postWithCommentsModel:PostWithCommentsModel = post.toBusinessModelWithComments()

        const output: GetPostWithCommentByIdOutputDTO = postWithCommentsModel
        return output as GetPostWithCommentByIdOutputDTO
    }

    public editPostById = async (input: EditPostByIdInputDTO): Promise<EditPostByIdOutputDTO> => {
        const { postId, content, token } = input

        const payload: TokenPayload | null = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new UnauthorizedError()
        }

        const postDB: PostDB | undefined = await this.postsDatabase.getPostById(postId)
    
        if (!postDB) {
            throw new NotFoundError("Post não encontrado.")
        }

        if (payload.role !== USER_ROLES.ADMIN){
            if (payload.id !== postDB.creator_id) {
              throw new ForbiddenError("Somente o criador ou um ADMIN podem editar o post. Caso não tenha acesso a sua conta, entre em contato com nosso suporte.")
            }
        }
    
        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.comments,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            payload.id,
            payload.username,
            []
        )

        post.CONTENT = content
        post.UPDATED_AT = new Date().toISOString()

        const updatedPostDB:PostDB = post.toDBModel()
        await this.postsDatabase.updatePostById(updatedPostDB)
    
        const output:EditPostByIdOutputDTO = {
            message: "Post atualizado com sucesso!",
        }

        return output as EditPostByIdOutputDTO
    }
    
    public deletePostById = async (input: DeletePostByIdInputDTO): Promise<DeletePostByIdOutputDTO> => {
        
        const { postId, token } = input

        const payload: TokenPayload | null = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new UnauthorizedError()
        }

        const postDB: PostDB | undefined = await this.postsDatabase.getPostById(postId)
        
        if (!postDB) {
            throw new NotFoundError("Post não encontrado.")
        }

        if (payload.role !== USER_ROLES.ADMIN){
            if (payload.id !== postDB.creator_id) {
              throw new ForbiddenError("Somente o criador ou um ADMIN podem excluir o post. Caso não tenha acesso a sua conta, entre em contato com nosso suporte.")
            }
        }
        
        await this.postsDatabase.deleteUserById(postId)
    
        const output:DeletePostByIdOutputDTO = {
            message: "Post excluído com sucesso!",
        }

        return output as DeletePostByIdOutputDTO
    }
}