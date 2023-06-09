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
import { DeleteUserByIdSchema } from "../../../src/dtos/User/deleteUserById.dto";

describe("Testando deleteUserById", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new PostDatabaseMock(),
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
      )

    test("deve retornar mensagem de exclusão do user_admin concluída com sucesso", async () => {
        const input = DeleteUserByIdSchema.parse({
            id: "id-mock-admin",
            token: "token-mock-admin"
        })

        const output = await userBusiness.deleteUserById(input)

        expect(output).toEqual({
            message: "Cadastro excluído com sucesso!"
        })
    })

    test("deve retornar mensagem de exclusão do user_normal concluída com sucesso", async () => {
        const input = DeleteUserByIdSchema.parse({
            id: "id-mock-normal",
            token: "token-mock-normal"
        })

        const output = await userBusiness.deleteUserById(input)

        expect(output).toEqual({
            message: "Cadastro excluído com sucesso!"
        })
    })

    test("deve retornar mensagem de exclusão do user_test concluída com sucesso", async () => {
        const input = DeleteUserByIdSchema.parse({
            id: "id-mock",
            token: "token-mock"
        })

        const output = await userBusiness.deleteUserById(input)

        expect(output).toEqual({
            message: "Cadastro excluído com sucesso!"
        })
    })

    test("deve disparar erro de DTO para o id", async () => {
        expect.assertions(1);
        try {
            const input = DeleteUserByIdSchema.parse({
                id: "",
                token: "token-mock-normal"
            })
    
            const output = await userBusiness.deleteUserById(input)
        } catch (error) {
            if (error instanceof ZodError) {
                expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("id: String must contain at least 1 character(s)");
            }
        }
    });

    test("deve disparar erro de id não encontrado", async () => {
        expect.assertions(2);
        try {
            const input = DeleteUserByIdSchema.parse({
                id: "id-mock-invalido",
                token: "token-mock-admin"
            })
    
            const output = await userBusiness.deleteUserById(input)

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
            const input = DeleteUserByIdSchema.parse({
                id: "id-mock-normal",
                token: ""
            })
    
            const output = await userBusiness.deleteUserById(input)
        } catch (error) {
            if (error instanceof ZodError) {
                expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("token: String must contain at least 1 character(s)");
            }
        }
    });

    test("deve disparar erro de token inválido", async () => {
        expect.assertions(2);
        try {
            const input = DeleteUserByIdSchema.parse({
                id: "id-mock",
                token: "token-mock-invalido"
            })
    
            const output = await userBusiness.deleteUserById(input)
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
            const input = DeleteUserByIdSchema.parse({
                id: "id-mock-normal",
                token: "token-mock"
            })
    
            const output = await userBusiness.deleteUserById(input)
        } catch (error) {
            if (error instanceof ForbiddenError) {
                expect(error.message).toBe("Somente o próprio usuário ou um ADMIN podem excluir a conta. Caso não tenha acesso a sua conta, entre em contato com nosso suporte.");
                expect(error.statusCode).toBe(403);
            }
        }
    });

});