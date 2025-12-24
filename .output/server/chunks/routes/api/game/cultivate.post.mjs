import { c as defineEventHandler, e as setResponseStatus } from '../../../_/nitro.mjs';
import { g as getTokenFromRequest, c as createErrorResponse, v as verifyAuthToken, p as prisma, a as createSuccessResponse } from '../../../_/auth.mjs';
import { R as Realm, S as SpiritRoot, B as BASE_CULTIVATION_PER_SECOND, d as getSpiritRootMultiplier, e as getRealmMultiplier } from '../../../_/gameConstants.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';
import 'jsonwebtoken';
import 'bcryptjs';

function sanitizeUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    realm: user.realm,
    realmLabel: user.realmLabel,
    cultivation: user.cultivation,
    maxCultivation: user.maxCultivation,
    spiritRoot: user.spiritRoot,
    spiritRootLabel: user.spiritRootLabel
  };
}
function toRealm(value) {
  const realmValues = Object.values(Realm);
  if (realmValues.includes(value)) {
    return value;
  }
  return null;
}
function toSpiritRoot(value) {
  const rootValues = Object.values(SpiritRoot);
  if (rootValues.includes(value)) {
    return value;
  }
  return null;
}
const cultivate_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  try {
    const token = getTokenFromRequest(event);
    if (!token) {
      setResponseStatus(event, 401);
      return createErrorResponse("AUTH_UNAUTHORIZED", "\u8BF7\u5148\u767B\u5F55");
    }
    const payload = verifyAuthToken(token);
    if (!payload || !payload.userId) {
      setResponseStatus(event, 401);
      return createErrorResponse(
        "AUTH_UNAUTHORIZED",
        "\u767B\u5F55\u72B6\u6001\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55"
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId
      }
    });
    if (!user) {
      setResponseStatus(event, 404);
      return createErrorResponse("USER_NOT_FOUND", "\u7528\u6237\u4E0D\u5B58\u5728");
    }
    const now = /* @__PURE__ */ new Date();
    const lastCultivateAt = (_a = user.lastCultivateAt) != null ? _a : now;
    const elapsedMs = now.getTime() - lastCultivateAt.getTime();
    const elapsedSeconds = Math.floor(elapsedMs / 1e3);
    if (elapsedSeconds <= 0 || user.cultivation >= user.maxCultivation) {
      const updatedUser2 = await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          lastCultivateAt: now
        }
      });
      return createSuccessResponse(sanitizeUser(updatedUser2));
    }
    const realm = (_b = toRealm(user.realm)) != null ? _b : Realm.QI_1;
    const spiritRoot = (_c = toSpiritRoot(user.spiritRoot)) != null ? _c : SpiritRoot.TRUE;
    const gainPerSecond = BASE_CULTIVATION_PER_SECOND * getSpiritRootMultiplier(spiritRoot) * getRealmMultiplier(realm);
    const gain = Math.floor(gainPerSecond * elapsedSeconds);
    if (gain <= 0) {
      const updatedUser2 = await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          lastCultivateAt: now
        }
      });
      return createSuccessResponse(sanitizeUser(updatedUser2));
    }
    const newCultivation = Math.min(
      user.cultivation + gain,
      user.maxCultivation
    );
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        cultivation: newCultivation,
        lastCultivateAt: now
      }
    });
    return createSuccessResponse(sanitizeUser(updatedUser));
  } catch (error) {
    setResponseStatus(event, 500);
    return createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      "\u670D\u52A1\u5668\u5F00\u5C0F\u5DEE\u4E86\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5"
    );
  }
});

export { cultivate_post as default };
//# sourceMappingURL=cultivate.post.mjs.map
