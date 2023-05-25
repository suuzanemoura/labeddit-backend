export interface CommentDB {
    id: string,
    post_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
    creator_id: string,
}

export interface CommentWithCreatorDB extends CommentDB {
    creator_username: string
}

export interface CommentModel {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        username: string
    }
}

export class Comment {
    constructor(
      private id: string,
      private postId: string,
      private content: string,
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

    public toDBModel(): CommentDB {
        return {
            id: this.id,
            creator_id: this.creatorId,
            post_id: this.postId,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        }
    }
  
    public toBusinessModel(): CommentModel {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            creator: {
                id: this.creatorId,
                username: this.creatorUsername,
            }
        }
    }
}