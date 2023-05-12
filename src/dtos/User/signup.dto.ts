import { z } from "zod"

export const SignupSchema = z.object({
    username: z.string().min(2),
    email: z.string().email(),
    password: z.string().regex(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g), 'A senha deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial.')
})

export type SignupInputDTO = z.infer<typeof SignupSchema>;

export const SignupSchemaOutput = z.object({
    message: z.string().min(1),
    token: z.string().min(1)
  });

export type SignupOutputDTO = z.infer<typeof SignupSchemaOutput>;