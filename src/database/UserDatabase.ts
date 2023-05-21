import { BaseDatabase } from "./BaseDatabase";
import { UserDB } from "../models/User";

export class UserDatabase extends BaseDatabase{
    public static TABLE_USERS = "users"

    public async getUsers(q: string | undefined): Promise<UserDB[]> {
        if (q) {
            const usersDB:UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
                .where("username", "LIKE", `%${q}%`)
            return usersDB as UserDB[]
        } else {
            const usersDB: UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
            return usersDB as UserDB[]
        }
    }

    public async getUserByUsername(username: string): Promise<UserDB | undefined> {
        const [result]:UserDB[] = await BaseDatabase
          .connection(UserDatabase.TABLE_USERS)
          .where({username: username})

        return result as UserDB | undefined
    }

    public async getUserByEmail(email: string): Promise<UserDB | undefined> {
        const [result]:UserDB[] = await BaseDatabase
          .connection(UserDatabase.TABLE_USERS)
          .where({email: email})

        return result as UserDB | undefined
    }

    public async getUserById (id: string): Promise<UserDB | undefined> {
        const [result]: UserDB[] = await BaseDatabase
          .connection(UserDatabase.TABLE_USERS)
          .where({id: id})

        return result as UserDB | undefined
    }

    public async insertUser(newUserDB: UserDB): Promise<void> {
        await BaseDatabase
          .connection(UserDatabase.TABLE_USERS)
          .insert(newUserDB)
    }

    public async editUserById (userDB: UserDB): Promise<void> {
        await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .update(userDB)
        .where({id: userDB.id})
    }

    public async deleteUserById (id: string): Promise<void> {
        await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .del().where({id: id})
    }
}