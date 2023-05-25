import { BaseDatabase } from "../../src/database/BaseDatabase";
import { CommentDB, CommentWithCreatorDB } from "../../src/models/Comment";
import { COMMENT_LIKE, LikeDislikeCommentDB } from "../../src/models/LikeOrDislike";

export const commentsMock:CommentDB[] = [
    {
        id: 'c001',
        creator_id: 'id-mock-admin',
        content: 'Exemplo de Comentário 1',
        likes: 0,
        dislikes: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        post_id: 'p001'
    },
    {
        id: 'c002',
        creator_id: 'id-mock-normal',
        content: 'Exemplo de Comentário 2',
        likes: 0,
        dislikes: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        post_id: 'p001'
    },
    {
        id: 'c003',
        creator_id: 'id-mock-normal',
        content: 'Exemplo de Comentário 3',
        likes: 1,
        dislikes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        post_id: 'p002'
    },
    {
        id: 'c004',
        creator_id: 'id-mock',
        content: 'Exemplo de Comentário 4',
        likes: 1,
        dislikes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        post_id: 'p002'
    }
]

const likesOrDislikesCommentMock: LikeDislikeCommentDB[] = [
    {
        user_id: 'id-mock',
        post_id: 'p001',
        comment_id: 'c001',
        like: 0,
    },
    {
        user_id: 'id-mock',
        post_id: 'p001',
        comment_id: 'c002',
        like: 0,
    },
    {
        user_id: 'id-mock-admin',
        post_id: 'p002',
        comment_id: 'c003',
        like: 1,
    },
    {
        user_id: 'id-mock-admin',
        post_id: 'p002',
        comment_id: 'c004',
        like: 1,
    }
]

export class CommentDatabaseMock extends BaseDatabase {

    public async getCommentById(id: string): Promise<CommentDB | undefined>{

        return commentsMock.filter((comment) => comment.id === id)[0]
        
    }

    public async getCommentWithCreatorById(id: string): Promise<CommentWithCreatorDB | undefined>{

        switch (id) {
            case 'c001':
                return {
                    id: 'c001',
                    creator_id: 'id-mock-admin',
                    creator_username: 'user_normal',
                    content: 'Exemplo de Comentário 1',
                    likes: 0,
                    dislikes: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    post_id: 'p001'
                }
            case 'c002':
                return {
                    id: 'c002',
                    creator_id: 'id-mock-normal',
                    creator_username: 'user_normal',
                    content: 'Exemplo de Comentário 2',
                    likes: 0,
                    dislikes: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    post_id: 'p001'
                }

            case 'c003':
                return {
                    id: 'c003',
                    creator_id: 'id-mock-normal',
                    creator_username: 'user_admin',
                    content: 'Exemplo de Comentário 3',
                    likes: 1,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    post_id: 'p002'
                }

            case 'c004':
                return {
                    id: 'c004',
                    creator_id: 'id-mock',
                    creator_username: 'user_admin',
                    content: 'Exemplo de Comentário 4',
                    likes: 1,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    post_id: 'p002'
                }
        

            default:
                return undefined
        }
        
    }

    public async insertComment(newCommentDB: CommentDB): Promise<void> {
        
    }

    public async updateCommentById (commentDB: CommentDB): Promise<void> {
        
    }

    public async deleteCommentById (id: string): Promise<void> {
        
    }

    public async getLikeDislikeFromCommentById (likeDislikeCommentDB: LikeDislikeCommentDB):Promise<COMMENT_LIKE | undefined> {

        return likeDislikeCommentDB.user_id === "id-mock" && likeDislikeCommentDB.comment_id === "c001" ? 
        COMMENT_LIKE.ALREADY_DISLIKED
        : likeDislikeCommentDB.user_id === "id-mock-admin" && likeDislikeCommentDB.comment_id === "c003" ? 
        COMMENT_LIKE.ALREADY_LIKED 
        : likeDislikeCommentDB.user_id === "id-mock-admin" && likeDislikeCommentDB.comment_id === "c004" ? 
        COMMENT_LIKE.ALREADY_LIKED
        : likeDislikeCommentDB.user_id === "id-mock" && likeDislikeCommentDB.comment_id === "c001" ? 
        COMMENT_LIKE.ALREADY_DISLIKED 
        : undefined
    }

    public insertLikeDislikeInCommentById = async (likeDislikeCommentDB: LikeDislikeCommentDB): Promise<void> => {
            
    }

    public updateLikeDislikeFromCommentById = async (likeDislikeCommentDB: LikeDislikeCommentDB): Promise<void> => {
        
    }

    public removeLikeDislikeFromCommentById = async (likeDislikeCommentDB: LikeDislikeCommentDB): Promise<void> => {
        
    }

}