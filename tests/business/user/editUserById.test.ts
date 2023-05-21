import { UserBusiness } from "../../../src/business/UserBusiness";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { ZodError } from "zod";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { EditUserByIdSchema } from "../../../src/dtos/User/editUserById.dto";
import { BadRequestError } from "../../../src/errors/BadRequestError";
import { ConflictError } from "../../../src/errors/ConflictError";

describe("Testando editUserById", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new PostDatabaseMock(),
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
      )

    test("deve retornar mensagem de atualização concluída ao enviar a edição", async () => {
        const input = EditUserByIdSchema.parse({
            id: "id-mock",
            username: "usertest",
            email: "usertest@email.com",
            password: "UserTest@321",
            token: "token-mock"
        })

        const output = await userBusiness.editUserById(input)

        expect(output).toEqual({
            message: "Cadastro atualizado com sucesso!"
        })
    })

    test("deve disparar erro de DTO para o id", async () => {
        expect.assertions(1);
        try {
            const input = EditUserByIdSchema.parse({
                id: "",
                username: "usertest",
                email: "usertest@email.com",
                password: "UserTest@321",
                token: "token-mock-normal"
            })
    
            const output = await userBusiness.editUserById(input)
        } catch (error) {
            if (error instanceof ZodError) {
                expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("id: String must contain at least 1 character(s)");
            }
        }
    });

    test("deve disparar erro de id não encontrado", async () => {
        expect.assertions(2);
        try {
            const input = EditUserByIdSchema.parse({
                id: "id-mock-invalido",
                username: "usertest",
                email: "usertest@email.com",
                password: "UserTest@321",
                token: "token-mock-admin"
            })
    
            const output = await userBusiness.editUserById(input)

        } catch (error) {
        if (error instanceof NotFoundError) {
            expect(error.message).toBe("Cadastro não encontrado. Verifique o id e tente novamente.");
            expect(error.statusCode).toBe(404);
        }
        }
    });

    test("deve disparar erro de DTO para o token", async () => {
        expect.assertions(1);
        try {
            const input = EditUserByIdSchema.parse({
                id: "id-mock-normal",
                username: "usertest",
                email: "usertest@email.com",
                password: "UserTest@321",
                token: ""
            })
    
            const output = await userBusiness.editUserById(input)
        } catch (error) {
            if (error instanceof ZodError) {
                expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("token: String must contain at least 1 character(s)");
            }
        }
    });

    test("deve disparar erro de token inválido", async () => {
        expect.assertions(2);
        try {
            const input = EditUserByIdSchema.parse({
                id: "id-mock",
                username: "usertest",
                email: "usertest@email.com",
                password: "UserTest@321",
                token: "token-mock-invalido"
            })
    
            const output = await userBusiness.editUserById(input)
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                expect(error.message).toBe("Token inválido.");
                expect(error.statusCode).toBe(401);
            }
        }
    });

    test("deve disparar erro de token quando não for admin ou o próprio usuário", async () => {
        expect.assertions(2);
        try {
            const input = EditUserByIdSchema.parse({
                id: "id-mock-normal",
                username: "usertest",
                email: "usertest@email.com",
                password: "UserTest@321",
                token: "token-mock"
            })
    
            const output = await userBusiness.editUserById(input)
        } catch (error) {
            if (error instanceof ForbiddenError) {
                expect(error.message).toBe("Somente o próprio usuário ou um ADMIN podem editar a conta. Caso não tenha acesso a sua conta, entre em contato com nosso suporte.");
                expect(error.statusCode).toBe(403);
            }
        }
    });

    test("deve disparar erro quando todas as informações forem undefined", async () => {
        expect.assertions(3);
        try {
            const input = EditUserByIdSchema.parse({
                id: "id-mock-normal",
                username: undefined,
                email: undefined,
                password: undefined,
                token: "token-mock-normal"
            })
    
            const output = await userBusiness.editUserById(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400);
                expect(error).toBeInstanceOf(BadRequestError)
                expect(error.message).toBe("Requisição inválida.")
            }
        }

    });

    test("deve disparar erro de DTO para username", async () => {
        expect.assertions(1);
        try {
            const input = EditUserByIdSchema.parse({
                id: "id-mock-normal",
                username: "",
                token: "token-mock-normal"
            })
    
            const output = await userBusiness.editUserById(input)
        } catch (error) {
            if (error instanceof ZodError) {
                expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("username: String must contain at least 2 character(s)")
            }
        }

    });

    test("deve disparar erro que username já está em uso.", async () => {
        expect.assertions(2);
        try {
          const input = EditUserByIdSchema.parse({
            id: "id-mock-normal",
            username: "user_admin",
            token: "token-mock-normal"
          });
    
          const output = await userBusiness.editUserById(input)
        } catch (error) {
          if (error instanceof ConflictError) {
            expect(error.message).toBe("Esse username já está em uso, tente novamente com outro username.");
            expect(error.statusCode).toBe(409);
          }
        }
    });

    test("deve disparar erro de DTO para email", async () => {
        expect.assertions(1);
        try {
            const input = EditUserByIdSchema.parse({
                id: "id-mock-normal",
                email: "usertest.com",
                token: "token-mock-normal"
            })
    
            const output = await userBusiness.editUserById(input)
        } catch (error) {
            if (error instanceof ZodError) {
                expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("email: Invalid email")
            }
        }

    });

    test("deve disparar erro que não é possível usar o mesmo email em mais de uma conta", async () => {
        expect.assertions(2);
        try {
          const input = EditUserByIdSchema.parse({
            id: "id-mock",
            email: "usernormal@email.com",
            token: "token-mock"
          });
    
          const output = await userBusiness.editUserById(input)
        } catch (error) {
          if (error instanceof ConflictError) {
            expect(error.message).toBe("Não é possível usar o mesmo email em mais de uma conta.");
            expect(error.statusCode).toBe(409);
          }
        }
    });

    test("deve disparar erro de DTO para password", async () => {
        expect.assertions(1);
        try {
            const input = EditUserByIdSchema.parse({
                id: "id-mock-normal",
                password: "",
                token: "token-mock-normal"
            })
    
            const output = await userBusiness.editUserById(input)
        } catch (error) {
            if (error instanceof ZodError) {
                expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("password: A senha deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial.")
            }
        }

    });

});