import { CommentModel, CommentWithCreatorDB } from "./Comment"

export interface PostDB {
    id: string,
    content: string,
    comments: number,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
    creator_id: string,
}

export interface PostWithCreatorDB extends PostDB {
    creator_username: string
}

export interface PostModel {
    id: string,
    content: string,
    comments: number,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        username: string
    }
}

export interface PostWithCommentsDB{
    id: string,
    content: string,
    comments: number,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
    creator_id: string,
    creator_username: string,
    comments_post: CommentWithCreatorDB[]
}

export interface PostWithCommentsModel{
    id: string,
    content: string,
    comments: number,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        username: string,
    },
    commentsPost: CommentModel[]
} 

export class Post {
    constructor(
      private id: string,
      private content: string,
      private comments: number,
      private likes: number,
      private dislikes: number,
      private createdAt: string,
      private updatedAt: string,
      private creatorId: string,
      private creatorUsername: string
    ) {}
    
    public set CONTENT(newContent: string) {
        this.content = newContent;
    }

    public set UPDATED_AT(newUpdatedAt: string) {
        this.updatedAt = newUpdatedAt;
    }

    public addComment():void {
        this.comments += 1
    }

    public removeComment():void {
        this.comments -= 1
    }

    public addLike():void {
        this.likes += 1
    }

    public removeLike():void {
        this.likes -= 1
    }

    public addDislike():void {
        this.dislikes += 1
    }

    public removeDislike():void {
        this.dislikes -= 1
    }

    public toDBModel(): PostDB {
        return {
            id: this.id,
            creator_id: this.creatorId,
            content: this.content,
            comments: this.comments,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        }
    }
  
    public toBusinessModel(): PostModel {
        return {
            id: this.id,
            content: this.content,
            comments: this.comments,
            likes: this.likes,
            dislikes: this.dislikes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            creator: {
                id: this.creatorId,
                username: this.creatorUsername
            }
        }
    }

    public toBusinessModelWithComments(commentsPost:CommentModel[]): PostWithCommentsModel {
        return {
            id: this.id,
            content: this.content,
            comments: this.comments,
            likes: this.likes,
            dislikes: this.dislikes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            creator: {
                id: this.creatorId,
                username: this.creatorUsername
            },
            commentsPost: commentsPost
        }
    }
}