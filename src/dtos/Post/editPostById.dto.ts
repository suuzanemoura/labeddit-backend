import { z } from "zod"

export const EditPostByIdSchema = z.object({
    postId: z.string().min(1),
    content: z.string().min(1),
    token: z.string().min(1)
})

export type EditPostByIdInputDTO = z.infer<typeof EditPostByIdSchema>

export const EditPostByIdSchemaOutput = z.object({
    message: z.string().min(1)
})

export type EditPostByIdOutputDTO = z.infer<typeof EditPostByIdSchemaOutput>