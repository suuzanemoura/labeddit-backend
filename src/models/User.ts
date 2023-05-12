export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}
  
export interface UserDB {
    id: string,
    username: string,
    email: string,
    password: string,
    role: USER_ROLES,
    created_at: string,
}

export interface UserModel {
    id: string,
    username: string,
    email: string,
    role: USER_ROLES,
    createdAt: string
}

export interface TokenPayload {
    id: string,
    username: string,
    role: USER_ROLES
}

export class User {
    constructor(
    private id: string,
    private username: string,
    private email: string,
    private password: string,
    private role: USER_ROLES,
    private createdAt: string,
    ) {}

    public get ID(): string {
        return this.id;
    }

    public get USERNAME(): string {
        return this.username;
    }

    public get EMAIL(): string {
        return this.email;
    }

    public get PASSWORD(): string {
        return this.password;
    }

    public get ROLE(): USER_ROLES {
        return this.role
    }

    public get CREATED_AT(): string {
        return this.createdAt
    }

    public set NAME(newName: string) {
        this.username = newName;
    }

    public set EMAIL(newEmail: string) {
        this.email = newEmail;
    }

    public set PASSWORD(newPassword: string) {
        this.password = newPassword;
    }

    public set ROLE(newRole: USER_ROLES) {
        this.role = newRole;
    }

    public toDBModel(): UserDB {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            password: this.password,
            role: this.role,
            created_at: this.createdAt
        }
    }

    public toBusinessModel(): UserModel {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            role: this.role,
            createdAt: this.createdAt
        }
    }

    public toTokenPayload(): TokenPayload {
        return {
            id: this.id,
            username: this.username,
            role: this.role
        }
    }

}
  
    