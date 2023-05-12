import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase{
    public static TABLE_POSTS = "posts"
    public static TABLE_COMMENTS = "comments_posts"

    public async getPostsWithCreator(query: string | undefined): Promise<any[]>{

        if (query) {
        const result:any[] = await BaseDatabase
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

        return result as any []

        } else {
        const result: any[] = await BaseDatabase
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

        return result as any[]
        
        }
    }

    public async getPostById (id: string): Promise<any | undefined> {
        const [result]:any[] = await BaseDatabase
          .connection(PostDatabase.TABLE_POSTS)
          .where({id: id})

        return result as any | undefined
    }

    public async getPostWithCreatorAndCommentsById (id: string): Promise<any>{

        const [PostWithCreatorDB]:any[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                `${PostDatabase.TABLE_POSTS}.id`,
                `${PostDatabase.TABLE_POSTS}.content`,
                `${PostDatabase.TABLE_POSTS}.comments AS comments_quantity`,
                `${PostDatabase.TABLE_POSTS}.likes`,
                `${PostDatabase.TABLE_POSTS}.dislikes`,
                `${PostDatabase.TABLE_POSTS}.created_at`,
                `${PostDatabase.TABLE_POSTS}.updated_at`,
                `${PostDatabase.TABLE_POSTS}.creator_id`,
                `${UserDatabase.TABLE_USERS}.name AS creator_name`
            )
            .join(`${UserDatabase.TABLE_USERS}`, `${PostDatabase.TABLE_POSTS}.creator_id`, "=", `${UserDatabase.TABLE_USERS}.id`)
            .where({[`${PostDatabase.TABLE_POSTS}.id`]: id})

        const commentsDB:any[] = await BaseDatabase
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

        const result:any = {...PostWithCreatorDB, comments: commentsDB}

        return result as any
    }

    public async insertPost(newPostDB: any): Promise<void> {
        await BaseDatabase
          .connection(PostDatabase.TABLE_POSTS)
          .insert(newPostDB)
    }

    public async updatePostById (id: string, postDB: any): Promise<void> {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .update(postDB)
        .where({id: id})
    }

    public async deleteUserById (id: string): Promise<void> {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .del().where({id: id})
    }

}