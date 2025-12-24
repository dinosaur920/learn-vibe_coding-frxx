import { prisma } from "~/server/utils/prisma";
import {
  createErrorResponse,
  createSuccessResponse,
} from "~/server/utils/response";
import {
  getTokenFromRequest,
  verifyAuthToken,
} from "~/server/utils/auth";
import {
  Realm,
  MAX_REALM,
  getNextRealm,
  getRealmLabel,
  getRealmMaxCultivation,
} from "~/utils/gameConstants";
import { setResponseStatus } from "h3";
import type { User } from "@prisma/client";

type SanitizedUser = {
  id: number;
  username: string;
  email: string | null;
  realm: string;
  realmLabel: string;
  cultivation: number;
  maxCultivation: number;
  spiritRoot: string;
  spiritRootLabel: string;
};

function sanitizeUser(user: User): SanitizedUser {
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

function toRealm(value: string): Realm | null {
  const realmValues = Object.values(Realm);
  if (realmValues.includes(value as Realm)) {
    return value as Realm;
  }
  return null;
}

export default defineEventHandler(async (event) => {
  try {
    const token = getTokenFromRequest(event);

    if (!token) {
      setResponseStatus(event, 401);
      return createErrorResponse("AUTH_UNAUTHORIZED", "请先登录");
    }

    const payload = verifyAuthToken(token);

    if (!payload || !payload.userId) {
      setResponseStatus(event, 401);
      return createErrorResponse(
        "AUTH_UNAUTHORIZED",
        "登录状态已失效，请重新登录"
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      setResponseStatus(event, 404);
      return createErrorResponse("USER_NOT_FOUND", "用户不存在");
    }

    const realm = toRealm(user.realm) ?? Realm.QI_1;

    if (realm === MAX_REALM) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "BREAKTHROUGH_MAX_REALM",
        "已达当前版本最高境界"
      );
    }

    if (user.cultivation < user.maxCultivation) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "BREAKTHROUGH_CULTIVATION_NOT_ENOUGH",
        "当前修为尚未圆满"
      );
    }

    const nextRealm = getNextRealm(realm);

    if (!nextRealm) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "BREAKTHROUGH_MAX_REALM",
        "已达当前版本最高境界"
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        realm: nextRealm,
        realmLabel: getRealmLabel(nextRealm),
        cultivation: 0,
        maxCultivation: getRealmMaxCultivation(nextRealm),
        lastCultivateAt: new Date(),
      },
    });

    return createSuccessResponse(sanitizeUser(updatedUser));
  } catch (error) {
    setResponseStatus(event, 500);
    return createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      "服务器开小差了，请稍后重试"
    );
  }
});

