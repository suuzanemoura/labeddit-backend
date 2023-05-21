import { UserBusiness } from "../../../src/business/UserBusiness";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { USER_ROLES } from "../../../src/models/User";
import { ZodError } from "zod";
import { GetUsersSchema } from "../../../src/dtos/User/getUsers.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";

describe("Testando getUsers", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new PostDatabaseMock(),
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
      )

  test("deve retornar a lista de todos users sem a senha", async () => {
    const input = GetUsersSchema.parse({
      token: "token-mock-admin",
    });

    const output = await userBusiness.getUsers(input);

    expect(output).toHaveLength(3);
    expect(output).toEqual([
        {
            id: "id-mock-normal",
            username: "user_normal",
            email: "usernormal@email.com",
            createdAt: expect.any(String),
            role: USER_ROLES.NORMAL
          },
          {
            id: "id-mock-admin",
            username: "user_admin",
            email: "useradmin@email.com",
            createdAt: expect.any(String),
            role: USER_ROLES.ADMIN
          },
          {
            id: "id-mock",
            username: "user_test",
            email: "user@email.com",
            createdAt: expect.any(String),
            role: USER_ROLES.NORMAL
          },
    ]);
  });

  test("deve retornar a lista de todos users que contenham a query", async () => {
    const input = GetUsersSchema.parse({
        query: "normal",
        token: "token-mock-admin",
    });

    const output = await userBusiness.getUsers(input);

    expect(output).toHaveLength(1);
    expect(output).toEqual([
        {
            id: "id-mock-normal",
            username: "user_normal",
            email: "usernormal@email.com",
            createdAt: expect.any(String),
            role: USER_ROLES.NORMAL
          },
    ]);
  });

  test("deve disparar erro de DTO para o token", async () => {
    expect.assertions(1);
    try {
      const input = GetUsersSchema.parse({
        token: "",
      });

      const output = await userBusiness.getUsers(input);
    } catch (error) {
        if (error instanceof ZodError) {
            expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("token: String must contain at least 1 character(s)");
        }
    }
  });

  test("deve disparar erro de token inválido", async () => {
    expect.assertions(2);
    try {
      const input = GetUsersSchema.parse({
        token: "token-mock-invalido",
      });

      const output = await userBusiness.getUsers(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido.");
        expect(error.statusCode).toBe(401);
      }
    }
  });

  test("deve disparar erro de token quando não for admin", async () => {
    expect.assertions(2);
    try {
      const input = GetUsersSchema.parse({
        token: "token-mock-normal",
      });

      const output = await userBusiness.getUsers(input);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        expect(error.message).toBe("Somente ADMINS podem acessar esse recurso.");
        expect(error.statusCode).toBe(403);
      }
    }
  });

});