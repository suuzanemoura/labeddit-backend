import { CommentDB, CommentWithCreatorDB } from "../models/Comment";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class CommentDatabase extends BaseDatabase{
    public static TABLE_USERS = "users"
    public static TABLE_COMMENTS = "comments_posts"

    public async getCommentsWithCreator(): Promise<CommentWithCreatorDB[]>{

        const result: CommentWithCreatorDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .select(
                 `${CommentDatabase.TABLE_COMMENTS}.id`,
                 `${CommentDatabase.TABLE_COMMENTS}.post_id`,
                 `${CommentDatabase.TABLE_COMMENTS}.content`,
                 `${CommentDatabase.TABLE_COMMENTS}.likes`,
                 `${CommentDatabase.TABLE_COMMENTS}.dislikes`,
                 `${CommentDatabase.TABLE_COMMENTS}.created_at`,
                 `${CommentDatabase.TABLE_COMMENTS}.updated_at`,
                 `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
                 `${UserDatabase.TABLE_USERS}.name AS creator_name`
            )
            .join(`${UserDatabase.TABLE_USERS}`, `${CommentDatabase.TABLE_COMMENTS}.creator_id`, "=", `${UserDatabase.TABLE_USERS}.id`)

        return result as CommentWithCreatorDB[]
        
    }

    public async getCommentsById(id: string): Promise<CommentDB>{

        const [result]: CommentDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .where({id: id})

        return result as CommentDB
        
    }

    public async insertComment(newCommentDB: CommentDB): Promise<void> {
        await BaseDatabase
          .connection(CommentDatabase.TABLE_COMMENTS)
          .insert(newCommentDB)
    }

    public async updateCommentById (commentDB: CommentDB): Promise<void> {
        await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .update(commentDB)
        .where({id: commentDB.id})
    }

    public async deleteCommentById (id: string): Promise<void> {
        await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .del().where({id: id})
    }

}