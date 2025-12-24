import { c as defineEventHandler, e as setResponseStatus } from '../../../_/nitro.mjs';
import { g as getTokenFromRequest, c as createErrorResponse, v as verifyAuthToken, p as prisma, a as createSuccessResponse } from '../../../_/auth.mjs';
import { R as Realm, M as MAX_REALM, g as getNextRealm, a as getRealmMaxCultivation, b as getRealmLabel } from '../../../_/gameConstants.mjs';
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
const breakthrough_post = defineEventHandler(async (event) => {
  var _a;
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
    const realm = (_a = toRealm(user.realm)) != null ? _a : Realm.QI_1;
    if (realm === MAX_REALM) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "BREAKTHROUGH_MAX_REALM",
        "\u5DF2\u8FBE\u5F53\u524D\u7248\u672C\u6700\u9AD8\u5883\u754C"
      );
    }
    if (user.cultivation < user.maxCultivation) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "BREAKTHROUGH_CULTIVATION_NOT_ENOUGH",
        "\u5F53\u524D\u4FEE\u4E3A\u5C1A\u672A\u5706\u6EE1"
      );
    }
    const nextRealm = getNextRealm(realm);
    if (!nextRealm) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "BREAKTHROUGH_MAX_REALM",
        "\u5DF2\u8FBE\u5F53\u524D\u7248\u672C\u6700\u9AD8\u5883\u754C"
      );
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        realm: nextRealm,
        realmLabel: getRealmLabel(nextRealm),
        cultivation: 0,
        maxCultivation: getRealmMaxCultivation(nextRealm),
        lastCultivateAt: /* @__PURE__ */ new Date()
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

export { breakthrough_post as default };
//# sourceMappingURL=breakthrough.post.mjs.map
