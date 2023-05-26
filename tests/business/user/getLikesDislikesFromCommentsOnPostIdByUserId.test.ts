import { ZodError } from "zod";
import { UserBusiness } from "../../../src/business/UserBusiness";
import { GetLikesDislikesFromPostsByUserIdSchema } from "../../../src/dtos/User/getLikesDislikesFromPostsByUserId.dto";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { GetLikesDislikesFromCommentsOnPostIdByUserIdSchema } from "../../../src/dtos/User/getLikesDislikesFromCommentsByUserId.dto";

describe("Testando getLikesDislikesFromCommentsOnPostIdByUserId", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new PostDatabaseMock(),
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
      )

  test("deve retornar todos os likes e/ou dislikes em comentários do post 'p002' pelo usuário user_admin", async () => {
    const input = GetLikesDislikesFromCommentsOnPostIdByUserIdSchema.parse({
        id: "id-mock-admin",
        postId: "p002",
        token: "token-mock-admin",
    });

    const output = await userBusiness.getLikesDislikesFromCommentsOnPostIdByUserId(input)

    expect(output).toHaveLength(2)
    expect(output).toEqual(
      [{
        userId: 'id-mock-admin',
        postId: 'p002',
        commentId: 'c003',
        like: true,
    },
    {
        userId: 'id-mock-admin',
        postId: 'p002',
        commentId: 'c004',
        like: true,
    }]
    );
  });

  test("deve retornar todos os likes e/ou dislikes em comentários do post 'p001' pelo usuário user_test", async () => {
    const input = GetLikesDislikesFromCommentsOnPostIdByUserIdSchema.parse({
        id: "id-mock",
        postId: "p001",
        token: "token-mock",
    });

    const output = await userBusiness.getLikesDislikesFromCommentsOnPostIdByUserId(input)

    expect(output).toHaveLength(2)
    expect(output).toEqual(
      [
        {
          userId: 'id-mock',
          postId: 'p001',
          commentId: 'c001',
          like: false,
        },
        {
            userId: 'id-mock',
            postId: 'p001',
            commentId: 'c002',
            like: false,
        }
    ]
    );
  });

  test("deve retornar um array vazio de likes e/ou dislikes em comentários do post 'p001' pelo usuário user_normal", async () => {
    const input = GetLikesDislikesFromCommentsOnPostIdByUserIdSchema.parse({
        id: "id-mock-normal",
        postId: "p001",
        token: "token-mock-normal",
    });

    const output = await userBusiness.getLikesDislikesFromCommentsOnPostIdByUserId(input)

    expect(output).toHaveLength(0)
    expect(output).toEqual([]);
  });

  test("deve disparar erro de DTO para o id", async () => {
    expect.assertions(1);
    try {
      const input = GetLikesDislikesFromCommentsOnPostIdByUserIdSchema.parse({
        id: "",
        postId: "p001",
        token: "token-mock",
    });

    const output = await userBusiness.getLikesDislikesFromCommentsOnPostIdByUserId(input)
    } catch (error) {
        if (error instanceof ZodError) {
            expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("id: String must contain at least 1 character(s)");
        }
    }
  });

  test("deve disparar erro de id não encontrado", async () => {
    expect.assertions(2);
    try {
      const input = GetLikesDislikesFromCommentsOnPostIdByUserIdSchema.parse({
        id: "id-mock-invalido",
        postId: "p002",
        token: "token-mock-admin",
    });

    const output = await userBusiness.getLikesDislikesFromCommentsOnPostIdByUserId(input)
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("Cadastro não encontrado. Verifique o id e tente novamente.");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("deve disparar erro de DTO para o postId", async () => {
    expect.assertions(1);
    try {
      const input = GetLikesDislikesFromCommentsOnPostIdByUserIdSchema.parse({
        id: "id-mock",
        postId: "",
        token: "token-mock",
    });

    const output = await userBusiness.getLikesDislikesFromCommentsOnPostIdByUserId(input)
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("postId: String must contain at least 1 character(s)");
      }
    }
  });

  test("deve disparar erro de postId não encontrado", async () => {
    expect.assertions(2);
    try {
      const input = GetLikesDislikesFromCommentsOnPostIdByUserIdSchema.parse({
        id: "id-mock",
        postId: "id-invalido",
        token: "token-mock",
    });

    const output = await userBusiness.getLikesDislikesFromCommentsOnPostIdByUserId(input)
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("Post não encontrado. Verifique o id e tente novamente.");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("deve disparar erro de DTO para o token", async () => {
    expect.assertions(1);
    try {
      const input = GetLikesDislikesFromCommentsOnPostIdByUserIdSchema.parse({
        id: "id-mock-normal",
        postId: "p001",
        token: "",
    });

    const output = await userBusiness.getLikesDislikesFromCommentsOnPostIdByUserId(input)
    } catch (error) {
        if (error instanceof ZodError) {
            expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("token: String must contain at least 1 character(s)");
        }
    }
  });

  test("deve disparar erro de token inválido", async () => {
    expect.assertions(2);
    try {
      const input = GetLikesDislikesFromCommentsOnPostIdByUserIdSchema.parse({
        id: "id-mock-normal",
        postId: "p001",
        token: "token-mock-invalido",
    });

    const output = await userBusiness.getLikesDislikesFromCommentsOnPostIdByUserId(input)
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
      const input = GetLikesDislikesFromCommentsOnPostIdByUserIdSchema.parse({
        id: "id-mock",
        postId: "p001",
        token: "token-mock-normal",
    });

    const output = await userBusiness.getLikesDislikesFromCommentsOnPostIdByUserId(input)
    } catch (error) {
      if (error instanceof ForbiddenError) {
        expect(error.message).toBe("Somente o próprio usuário ou um ADMIN podem ter acesso às suas informações. Caso não tenha acesso a sua conta, entre em contato com nosso suporte.");
        expect(error.statusCode).toBe(403);
      }
    }
  });

});