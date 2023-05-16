import { z } from "zod"

export const GetPostWithCommentByIdSchema = z.object({
    postId: z.string().min(1),
    token: z.string().min(1)
})

export type GetPostWithCommentByIdInputDTO = z.infer<typeof GetPostWithCommentByIdSchema>

export const GetPostWithCommentByIdSchemaOutput = z.object({
    id: z.string(),
    content: z.string(),
    comments: z.number(),
    likes: z.number(),
    dislikes: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    creator: z.object({
        id: z.string(),
        username: z.string()
    }),
    commentsPost: z.array(
        z.object({
            id: z.string(),
            content: z.string(),
            likes: z.number(),
            dislikes: z.number(),
            createdAt: z.string(),
            updatedAt: z.string(),
            creator: z.object({
                id: z.string(),
                username: z.string()
            })
        }).optional()
    )
})

export type GetPostWithCommentByIdOutputDTO = z.infer<typeof GetPostWithCommentByIdSchemaOutput>