import { z } from "zod"
import { USER_ROLES, UserModel } from "../../models/User"


export const GetUsersSchema = z.object({
    query: z.string().min(1).optional(),
    token: z.string().min(1)
})

export type GetUsersInputDTO = z.infer<typeof GetUsersSchema>;

export const GetUsersSchemaOutput = z.array(
    z.object({
        id: z.string(),
        username: z.string(),
        email: z.string().email(),
        role: z.nativeEnum(USER_ROLES),
        createdAt: z.string()
    })
)

export type GetUsersOutputDTO = z.infer<typeof GetUsersSchemaOutput>
