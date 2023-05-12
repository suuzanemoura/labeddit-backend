import { z } from "zod"

export const DeleteUserByIdSchema = z.object({
    id: z.string().min(1),
    token: z.string().min(1)
})

export type DeleteUserByIdInputDTO = z.infer<typeof DeleteUserByIdSchema>

export const DeleteUserByIdSchemaOutput = z.object({
    message: z.string().min(1)
})

export type DeleteUserByIdOutputDTO = z.infer<typeof DeleteUserByIdSchemaOutput>