import { z } from "zod"

export const GetLikesDislikesFromPostsByUserIdSchema = z.object({
    id: z.string().min(1),
    token: z.string().min(1)
})

export type GetLikesDislikesFromPostsByUserIdInputDTO = z.infer<typeof GetLikesDislikesFromPostsByUserIdSchema>;

export const GetLikesDislikesFromPostsByUserIdSchemaOutput = z.array(
    z.object({
        userId: z.string(),
        postId: z.string(),
        like: z.boolean()
    })
)

export type GetLikesDislikesFromPostsByUserIdOutputDTO = z.infer<typeof GetLikesDislikesFromPostsByUserIdSchemaOutput>