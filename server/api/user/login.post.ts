import { prisma } from "~/server/utils/prisma";
import {
  createErrorResponse,
  createSuccessResponse,
} from "~/server/utils/response";
import {
  setAuthCookie,
  verifyPassword,
  signAuthToken,
} from "~/server/utils/auth";
import { setResponseStatus } from "h3";
import type { User } from "@prisma/client";

type LoginBody = {
  username?: string;
  password?: string;
};

function sanitizeUser(user: User) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    realm: user.realm,
    realmLabel: user.realmLabel,
    cultivation: user.cultivation,
    maxCultivation: user.maxCultivation,
    spiritRoot: user.spiritRoot,
    spiritRootLabel: user.spiritRootLabel,
  };
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<LoginBody>(event);
    const username = body.username?.trim();
    const password = body.password?.trim();

    if (!username || !password) {
      setResponseStatus(event, 400);
      return createErrorResponse("VALIDATION_ERROR", "请输入账号和密码");
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      setResponseStatus(event, 401);
      return createErrorResponse("AUTH_INVALID_CREDENTIALS", "账号或密码错误");
    }

    const valid = await verifyPassword(password, user.passwordHash);

    if (!valid) {
      setResponseStatus(event, 401);
      return createErrorResponse("AUTH_INVALID_CREDENTIALS", "账号或密码错误");
    }

    const token = signAuthToken(user.id);
    setAuthCookie(event, token);

    return createSuccessResponse(sanitizeUser(user));
  } catch (error) {
    setResponseStatus(event, 500);
    return createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      "服务器开小差了，请稍后重试"
    );
  }
});
