import { z } from "zod"

export const EditUserByIdSchema = z.object({
    id: z.string().min(1),
    username: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().regex(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g), 'A senha deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial.').optional(),
    token: z.string().min(1)
})

export type EditUserByIdInputDTO = z.infer<typeof EditUserByIdSchema>

export const EditUserByIdSchemaOutput = z.object({
    message: z.string().min(1)
})

export type EditUserByIdOutputDTO = z.infer<typeof EditUserByIdSchemaOutput>