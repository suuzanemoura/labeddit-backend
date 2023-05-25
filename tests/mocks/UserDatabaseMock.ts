import { USER_ROLES, UserDB } from "../../src/models/User";
import { BaseDatabase } from "../../src/database/BaseDatabase";
import { LikeDislikeCommentDB, LikeDislikePostDB } from "../../src/models/LikeOrDislike";

export const usersMock: UserDB[] = [
  {
    id: "id-mock-normal",
    username: "user_normal",
    email: "usernormal@email.com",
    password: "hash-mock-normal", // senha = "Normal@123"
    created_at: new Date().toISOString(),
    role: USER_ROLES.NORMAL
  },
  {
    id: "id-mock-admin",
    username: "user_admin",
    email: "useradmin@email.com",
    password: "hash-mock-admin", // senha = "Admin@123"
    created_at: new Date().toISOString(),
    role: USER_ROLES.ADMIN
  },
  {
    id: "id-mock",
    username: "user_test",
    email: "user@email.com",
    password: "hash-mock-test", // senha = "User@123"
    created_at: new Date().toISOString(),
    role: USER_ROLES.NORMAL
  },
]

export class UserDatabaseMock extends BaseDatabase {

    public async getUsers(q: string | undefined): Promise<UserDB[]> {
        if (q) {
            return usersMock.filter(user =>
                user.username.toLocaleLowerCase().includes(q.toLocaleLowerCase())
            )
        } else {
            return usersMock
        }
    }

    public async getUserById(id: string): Promise<UserDB | undefined> {
        return usersMock.filter(user => user.id === id)[0]
    }

    public async getUserByUsername(username: string): Promise<UserDB | undefined> {
        return usersMock.filter(user => user.username === username)[0]
    }

    public async getUserByEmail(email: string): Promise<UserDB | undefined> {
        return usersMock.filter(user => user.email === email)[0]
    }

    public async getLikesDislikesFromPostsByUserId (id: string):Promise<LikeDislikePostDB[]> {

      switch (id) {
        case "id-mock-admin":
          return [
            {
              user_id: 'id-mock-admin',
              post_id: 'p001',
              like: 1,
            }
          ]
        case "id-mock-normal":
          return [
            {
                user_id: 'id-mock-normal',
                post_id: 'p002',
                like: 0,
            }
          ]
      
        default:
          return []
      }
      
    }

  public async getLikesDislikesFromCommentsByUserId (id: string):Promise<LikeDislikeCommentDB[]> {

    switch (id) {
      case "id-mock-admin":
        return [
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

      case "id-mock":
        return [
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
          }
        ]
    
      default:
        return []
    }

  }

  public async getLikesDislikesFromCommentsOnPostIdByUserId (id: string, postId: string):Promise<LikeDislikeCommentDB[]> {

    return id === "id-mock-admin" && postId === "p002" ?
      [{
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
      }]
    : id === "id-mock" && postId === "p001" ?
    [{
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
    }]
    : []
  }

    public async insertUser(newUserDB: UserDB): Promise<void> {
        
    }

    public async editUserById(userDB: UserDB): Promise<void> {
        
    }

    public async deleteUserById(idToDelete: string): Promise<void> {

    }
}