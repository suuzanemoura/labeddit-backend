import { z } from "zod"

export const GetLikesDislikesFromCommentsOnPostIdByUserIdSchema = z.object({
    id: z.string().min(1),
    postId: z.string().min(1),
    token: z.string().min(1)
})

export type GetLikesDislikesFromCommentsOnPostIdByUserIdInputDTO = z.infer<typeof GetLikesDislikesFromCommentsOnPostIdByUserIdSchema>;

export const GetLikesDislikesFromCommentsOnPostIdByUserIdSchemaOutput = z.array(
    z.object({
        userId: z.string(),
        postId: z.string(),
        commentId: z.string(),
        like: z.boolean()
    })
)

export type GetLikesDislikesFromCommentsOnPostIdByUserIdOutputDTO = z.infer<typeof GetLikesDislikesFromCommentsOnPostIdByUserIdSchemaOutput>