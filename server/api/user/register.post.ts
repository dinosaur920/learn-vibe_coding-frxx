import { prisma } from "~/server/utils/prisma";
import { hashPassword } from "~/server/utils/auth";
import {
  createErrorResponse,
  createSuccessResponse,
} from "~/server/utils/response";
import {
  Realm,
  getRealmLabel,
  getRealmMaxCultivation,
  getRandomSpiritRoot,
  getSpiritRootLabel,
} from "~/utils/gameConstants";
import { setResponseStatus } from "h3";
import type { User } from "@prisma/client";

type RegisterBody = {
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
    const body = await readBody<RegisterBody>(event);
    const username = body.username?.trim();
    const password = body.password?.trim();

    if (!username || !password) {
      setResponseStatus(event, 400);
      return createErrorResponse("VALIDATION_ERROR", "请输入账号和密码");
    }

    const existing = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existing) {
      setResponseStatus(event, 409);
      return createErrorResponse("AUTH_USERNAME_TAKEN", "该账号已被注册");
    }

    const passwordHash = await hashPassword(password);
    const realm = Realm.QI_1;
    const spiritRoot = getRandomSpiritRoot();
    const realmLabel = getRealmLabel(realm);
    const maxCultivation = getRealmMaxCultivation(realm);
    const spiritRootLabel = getSpiritRootLabel(spiritRoot);

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        realm,
        realmLabel,
        cultivation: 0,
        maxCultivation,
        spiritRoot,
        spiritRootLabel,
        lastCultivateAt: new Date(),
      },
    });

    setResponseStatus(event, 201);
    return createSuccessResponse(sanitizeUser(user));
  } catch (error) {
    setResponseStatus(event, 500);
    return createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      "服务器开小差了，请稍后重试"
    );
  }
});
