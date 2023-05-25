import { PostDB, PostWithCommentsDB, PostWithCreatorDB } from "../../src/models/Post";
import { BaseDatabase } from "../../src/database/BaseDatabase";
import { usersMock } from "./UserDatabaseMock";
import { UserDB } from "../../src/models/User";
import { LikeDislikePostDB, POST_LIKE } from "../../src/models/LikeOrDislike";

const postsMock: PostDB[] = [
  {
    id: "p001",
    creator_id: "id-mock-normal",
    content: "Exemplo de conteúdo de post 1",
    comments: 2,
    likes: 1,
    dislikes: 0, 
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "p002",
    creator_id: "id-mock-admin",
    content: "Exemplo de conteúdo de post 2",
    comments: 2,
    likes: 0,
    dislikes: 1, 
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "p003",
    creator_id: "id-mock",
    content: "Exemplo de conteúdo de post 3",
    comments: 0,
    likes: 0,
    dislikes: 0, 
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
]

export const likesOrDislikesPostMock: LikeDislikePostDB[] = [
    {
        user_id: 'id-mock-admin',
        post_id: 'p001',
        like: 1,
    },
    {
        user_id: 'id-mock-normal',
        post_id: 'p002',
        like: 0,
    }
]

export class PostDatabaseMock extends BaseDatabase {

    public async getPostsWithCreator(query: string | undefined): Promise<PostWithCreatorDB[]> {
        if (query) {

            const postsMockWithCreator:PostWithCreatorDB[] = postsMock.map((postMock) => {

                const user:UserDB = usersMock.filter((user) => user.id === postMock.creator_id)[0]

                const post:PostWithCreatorDB = {
                    ...postMock,
                    creator_username: user.username
                }

                return post
            })

            return postsMockWithCreator.filter(post =>
                post.content.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )

        } else {
            return postsMock.map((postMock) => {

                const user:UserDB = usersMock.filter((user) => user.id === postMock.creator_id)[0]

                const post:PostWithCreatorDB = {
                    ...postMock,
                    creator_username: user.username
                }

                return post
            })
        }
    }

    public async getPostById(id: string): Promise<PostDB | undefined> {
        return postsMock.filter(post => post.id === id)[0]
    }

    public async getPostWithCreatorById(id: string): Promise<PostWithCreatorDB | undefined> {
        
        switch (id) {
            case "p001":
                return {
                    id: "p001",
                    content: "Exemplo de conteúdo de post 1",
                    comments: 2,
                    likes: 1,
                    dislikes: 0, 
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    creator_id: "id-mock-normal",
                    creator_username: "user_normal",
                  }
            case "p002":
                return {
                    id: "p002",
                    content: "Exemplo de conteúdo de post 2",
                    comments: 2,
                    likes: 0,
                    dislikes: 1, 
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    creator_id: "id-mock-admin",
                    creator_username: "user_admin",
                }
        
            default:
                return undefined
        }
    }

    public async getPostWithCreatorAndCommentsById (id: string): Promise<PostWithCommentsDB | undefined>{
        
        switch (id) {
            case "p001":
                return {
                    id: "p001",
                    content: "Exemplo de conteúdo de post 1",
                    comments: 2,
                    likes: 1,
                    dislikes: 0, 
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    creator_id: "id-mock-normal",
                    creator_username: "user_normal",
                    comments_post: [
                        {
                            id: 'c001',
                            content: 'Exemplo de Comentário 1',
                            likes: 0,
                            dislikes: 1,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                            post_id: 'p001',
                            creator_id: "id-mock-admin",
                            creator_username: "user_admin"
                        },
                        {
                            id: 'c002',
                            content: 'Exemplo de Comentário 2',
                            likes: 0,
                            dislikes: 1,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                            post_id: 'p001',
                            creator_id: "id-mock-normal",
                            creator_username: "user_normal"
                        },
                    ]
                  }
            case "p002":
                return {
                    id: "p002",
                    content: "Exemplo de conteúdo de post 2",
                    comments: 2,
                    likes: 0,
                    dislikes: 1, 
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    creator_id: "id-mock-admin",
                    creator_username: "user_admin",
                    comments_post: [
                        {
                            id: 'c003',
                            content: 'Exemplo de Comentário 3',
                            likes: 1,
                            dislikes: 0,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                            post_id: 'p002',
                            creator_id: "id-mock-normal",
                            creator_username: "user_normal",
                        },
                        {
                            id: 'c004',
                            content: 'Exemplo de Comentário 4',
                            likes: 1,
                            dislikes: 0,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                            post_id: 'p002',
                            creator_id: "id-mock",
                            creator_username: "user_test"
                        }
                    ]
                }
        
            default:
                return undefined
        }
    }

    public async insertPost(postDB: PostDB): Promise<void> {

    }

    public async updatePostById(postDB: PostDB): Promise<void> {

    }

    public async deletePostById(idToDelete: string): Promise<void> {

    }

    public async getLikeDislikeFromPostById (likeDislikePostDB: LikeDislikePostDB):Promise<POST_LIKE | undefined> {

        switch (likeDislikePostDB.user_id && likeDislikePostDB.post_id) {
            case "id-mock-admin" && "p001":
                  return POST_LIKE.ALREADY_LIKED

            case "id-mock-normal" && "p002":
                return POST_LIKE.ALREADY_DISLIKED
                  
            default:
                return undefined
        }
    }

    public removeLikeDislikeFromPostById = async (likeDislikePostDB: LikeDislikePostDB): Promise<void> => {

    }
    
    public updateLikeDislikeFromPostById = async (likeDislikePostDB: LikeDislikePostDB): Promise<void> => {
        
    }
  
    public insertLikeDislikeInPostById = async (likeDislikePostDB: LikeDislikePostDB): Promise<void> => {
        
    }
}