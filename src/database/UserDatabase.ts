import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase{
    public static TABLE_USERS = "users"

    public async getUsers(q: string | undefined): Promise<UserDB[]> {
        if (q) {
            const usersDB:UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
                .where("name", "LIKE", `%${q}%`)
            return usersDB as UserDB[]
        } else {
            const usersDB: UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
            return usersDB as UserDB[]
        }
    }

    public async getUserByEmail(email: string): Promise<UserDB> {
        const [result]:UserDB[] = await BaseDatabase
          .connection(UserDatabase.TABLE_USERS)
          .where({email: email})

        return result as UserDB
    }

    public async getUserById (id: string): Promise<UserDB> {
        const [result]: UserDB[] = await BaseDatabase
          .connection(UserDatabase.TABLE_USERS)
          .where({id: id})

        return result as UserDB
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