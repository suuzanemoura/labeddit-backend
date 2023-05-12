import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase{
    public static TABLE_USERS = "users"

    public async getUsers(q: string | undefined): Promise<any | undefined> {
        if (q) {
            const usersDB:any[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
                .where("name", "LIKE", `%${q}%`)
            return usersDB as any []
        } else {
            const usersDB: any[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
            return usersDB as any[]
        }
    }

    public async getUserByEmail(email: string): Promise<any | undefined> {
        const [result]: any[] = await BaseDatabase
          .connection(UserDatabase.TABLE_USERS)
          .where({email: email})

        return result as any[]
    }

    public async getUserById (id: string): Promise<any | undefined> {
        const [result]: any[] = await BaseDatabase
          .connection(UserDatabase.TABLE_USERS)
          .where({id: id})

        return result as any[]
    }

    public async insertUser(newUserDB: any): Promise<void> {
        await BaseDatabase
          .connection(UserDatabase.TABLE_USERS)
          .insert(newUserDB)
    }

    public async editUserById (id: string, userDB: any): Promise<void> {
        await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .update(userDB)
        .where({id: id})
    }

    public async deleteUserById (id: string): Promise<void> {
        await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .del().where({id: id})
    }
}