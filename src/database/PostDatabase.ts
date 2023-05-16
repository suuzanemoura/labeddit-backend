import { CommentWithCreatorDB } from "../models/Comment";
import { Post, PostDB, PostWithCommentsDB, PostWithCreatorDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase{
    public static TABLE_POSTS = "posts"
    public static TABLE_COMMENTS = "comments_posts"

    public async getPostsWithCreator(query: string | undefined): Promise<PostWithCreatorDB[]>{

        if (query) {
        const result:PostWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .where("content", "LIKE", `%${query}%`)
            .select(
                `${PostDatabase.TABLE_POSTS}.id`,
                `${PostDatabase.TABLE_POSTS}.content`,
                `${PostDatabase.TABLE_POSTS}.comments`,
                `${PostDatabase.TABLE_POSTS}.likes`,
                `${PostDatabase.TABLE_POSTS}.dislikes`,
                `${PostDatabase.TABLE_POSTS}.created_at`,
                `${PostDatabase.TABLE_POSTS}.updated_at`,
                `${PostDatabase.TABLE_POSTS}.creator_id`,
                `${UserDatabase.TABLE_USERS}.name AS creator_name`
            )
            .join(`${UserDatabase.TABLE_USERS}`, `${PostDatabase.TABLE_POSTS}.creator_id`, "=", `${UserDatabase.TABLE_USERS}.id`)

        return result as PostWithCreatorDB[]

        } else {
        const result: PostWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                 `${PostDatabase.TABLE_POSTS}.id`,
                 `${PostDatabase.TABLE_POSTS}.content`,
                 `${PostDatabase.TABLE_POSTS}.comments`,
                 `${PostDatabase.TABLE_POSTS}.likes`,
                 `${PostDatabase.TABLE_POSTS}.dislikes`,
                 `${PostDatabase.TABLE_POSTS}.created_at`,
                 `${PostDatabase.TABLE_POSTS}.updated_at`,
                 `${PostDatabase.TABLE_POSTS}.creator_id`,
                 `${UserDatabase.TABLE_USERS}.name AS creator_name`
            )
            .join(`${UserDatabase.TABLE_USERS}`, `${PostDatabase.TABLE_POSTS}.creator_id`, "=", `${UserDatabase.TABLE_USERS}.id`)

        return result as PostWithCreatorDB[]
        
        }
    }

    public async getPostById (id: string): Promise<PostDB | undefined> {
        const [result]:PostDB[] = await BaseDatabase
          .connection(PostDatabase.TABLE_POSTS)
          .where({id: id})

        return result as PostDB | undefined
    }

    public async getPostWithCreatorAndCommentsById (id: string): Promise<PostWithCommentsDB>{

        const [PostWithCreatorDB]:PostWithCommentsDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                `${PostDatabase.TABLE_POSTS}.id`,
                `${PostDatabase.TABLE_POSTS}.content`,
                `${PostDatabase.TABLE_POSTS}.comments`,
                `${PostDatabase.TABLE_POSTS}.likes`,
                `${PostDatabase.TABLE_POSTS}.dislikes`,
                `${PostDatabase.TABLE_POSTS}.created_at`,
                `${PostDatabase.TABLE_POSTS}.updated_at`,
                `${PostDatabase.TABLE_POSTS}.creator_id`,
                `${UserDatabase.TABLE_USERS}.name AS creator_name`
            )
            .join(`${UserDatabase.TABLE_USERS}`, `${PostDatabase.TABLE_POSTS}.creator_id`, "=", `${UserDatabase.TABLE_USERS}.id`)
            .where({[`${PostDatabase.TABLE_POSTS}.id`]: id})

        const commentsDB:CommentWithCreatorDB[] = await BaseDatabase
        .connection(PostDatabase.TABLE_COMMENTS)
        .select(
            `${PostDatabase.TABLE_COMMENTS}.id`,
            `${PostDatabase.TABLE_COMMENTS}.content`,
            `${PostDatabase.TABLE_COMMENTS}.likes`,
            `${PostDatabase.TABLE_COMMENTS}.dislikes`,
            `${PostDatabase.TABLE_COMMENTS}.created_at`,
            `${PostDatabase.TABLE_COMMENTS}.updated_at`,
            `${PostDatabase.TABLE_COMMENTS}.creator_id`,
            `${UserDatabase.TABLE_USERS}.name AS creator_name`
        )
        .join(`${UserDatabase.TABLE_USERS}`, `${PostDatabase.TABLE_COMMENTS}.creator_id`, "=", `${UserDatabase.TABLE_USERS}.id`)
        .where({[`${PostDatabase.TABLE_COMMENTS}.post_id`]: id})

        const result: PostWithCommentsDB = {...PostWithCreatorDB, comments_post: commentsDB}

        return result as PostWithCommentsDB
    }

    public async insertPost(newPostDB: PostDB): Promise<void> {
        await BaseDatabase
          .connection(PostDatabase.TABLE_POSTS)
          .insert(newPostDB)
    }

    public async updatePostById (postDB: PostDB): Promise<void> {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .update(postDB)
        .where({id: postDB.id})
    }

    public async deleteUserById (id: string): Promise<void> {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .del().where({id: id})
    }

}