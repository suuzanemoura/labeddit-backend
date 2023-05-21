import { UserBusiness } from "../../../src/business/UserBusiness";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { USER_ROLES } from "../../../src/models/User";
import { ZodError } from "zod";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { GetUserByIdSchema } from "../../../src/dtos/User/getUserById.dto";
import { NotFoundError } from "../../../src/errors/NotFoundError";

describe("Testando getUserById", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new PostDatabaseMock(),
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
      )

  test("deve retornar um user igual ao id do input", async () => {
    const input = GetUserByIdSchema.parse({
        id: "id-mock-normal",
        token: "token-mock-normal",
    });

    const output = await userBusiness.getUserById(input)
    expect(output).toEqual(
        {
            id: "id-mock-normal",
            username: "user_normal",
            email: "usernormal@email.com",
            createdAt: expect.any(String),
            role: USER_ROLES.NORMAL
        }
    );
  });

  test("deve disparar erro de DTO para o id", async () => {
    expect.assertions(1);
    try {
      const input = GetUserByIdSchema.parse({
        id: "",
        token: "id-mock-normal",
      });

      const output = await userBusiness.getUserById(input);
    } catch (error) {
        if (error instanceof ZodError) {
            expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("id: String must contain at least 1 character(s)");
        }
    }
  });

  test("deve disparar erro de id não encontrado", async () => {
    expect.assertions(2);
    try {
      const input = GetUserByIdSchema.parse({
        id: "id-mock-invalido",
        token: "token-mock-admin",
      });

      const output = await userBusiness.getUserById(input);
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
      const input = GetUserByIdSchema.parse({
        id: "id-mock-normal",
        token: "",
      });

      const output = await userBusiness.getUserById(input);
    } catch (error) {
        if (error instanceof ZodError) {
            expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("token: String must contain at least 1 character(s)");
        }
    }
  });

  test("deve disparar erro de token inválido", async () => {
    expect.assertions(2);
    try {
      const input = GetUserByIdSchema.parse({
        id: "id-mock-normal",
        token: "token-mock-invalido",
      });

      const output = await userBusiness.getUserById(input);
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
      const input = GetUserByIdSchema.parse({
        id: "id-mock",
        token: "token-mock-normal",
      });

      const output = await userBusiness.getUserById(input);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        expect(error.message).toBe("Somente o próprio usuário ou um ADMIN podem ter acesso às suas informações. Caso não tenha acesso a sua conta, entre em contato com nosso suporte.");
        expect(error.statusCode).toBe(403);
      }
    }
  });

});