import { z } from "zod"
import { USER_ROLES } from "../../models/User"


export const GetUserByIdSchema = z.object({
    id: z.string().min(1),
    token: z.string().min(1)
})

export type GetUserByIdInputDTO = z.infer<typeof GetUserByIdSchema>;

export const GetUserByIdSchemaOutput = z.object({
    id: z.string(),
    username: z.string(),
    email: z.string().email(),
    role: z.nativeEnum(USER_ROLES),
    createdAt: z.string()
})

export type GetUserByIdOutputDTO = z.infer<typeof GetUserByIdSchemaOutput>