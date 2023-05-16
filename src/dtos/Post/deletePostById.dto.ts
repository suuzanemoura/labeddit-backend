import { z } from "zod"

export const DeletePostByIdSchema = z.object({
    postId: z.string().min(1),
    token: z.string().min(1)
})

export type DeletePostByIdInputDTO = z.infer<typeof DeletePostByIdSchema>

export const DeletePostByIdSchemaOutput = z.object({
    message: z.string().min(1)
})

export type DeletePostByIdOutputDTO = z.infer<typeof DeletePostByIdSchemaOutput>