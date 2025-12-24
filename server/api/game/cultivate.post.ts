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
  BASE_CULTIVATION_PER_SECOND,
  Realm,
  SpiritRoot,
  getRealmMultiplier,
  getSpiritRootMultiplier,
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

function toSpiritRoot(value: string): SpiritRoot | null {
  const rootValues = Object.values(SpiritRoot);
  if (rootValues.includes(value as SpiritRoot)) {
    return value as SpiritRoot;
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

    const now = new Date();
    const lastCultivateAt = user.lastCultivateAt ?? now;
    const elapsedMs = now.getTime() - lastCultivateAt.getTime();
    const elapsedSeconds = Math.floor(elapsedMs / 1000);

    if (elapsedSeconds <= 0 || user.cultivation >= user.maxCultivation) {
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          lastCultivateAt: now,
        },
      });

      return createSuccessResponse(sanitizeUser(updatedUser));
    }

    const realm = toRealm(user.realm) ?? Realm.QI_1;
    const spiritRoot = toSpiritRoot(user.spiritRoot) ?? SpiritRoot.TRUE;

    const gainPerSecond =
      BASE_CULTIVATION_PER_SECOND *
      getSpiritRootMultiplier(spiritRoot) *
      getRealmMultiplier(realm);

    const gain = Math.floor(gainPerSecond * elapsedSeconds);

    if (gain <= 0) {
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          lastCultivateAt: now,
        },
      });

      return createSuccessResponse(sanitizeUser(updatedUser));
    }

    const newCultivation = Math.min(
      user.cultivation + gain,
      user.maxCultivation
    );

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        cultivation: newCultivation,
        lastCultivateAt: now,
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

