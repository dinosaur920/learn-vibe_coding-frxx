import { c as defineEventHandler, e as setResponseStatus } from '../../../_/nitro.mjs';
import { g as getTokenFromRequest, c as createErrorResponse, v as verifyAuthToken, p as prisma, a as createSuccessResponse } from '../../../_/auth.mjs';
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
const profile_get = defineEventHandler(
  async (event) => {
    try {
      const token = getTokenFromRequest(event);
      if (!token) {
        setResponseStatus(event, 401);
        return createErrorResponse("AUTH_UNAUTHORIZED", "\u8BF7\u5148\u767B\u5F55");
      }
      const payload = verifyAuthToken(token);
      if (!payload || !payload.userId) {
        setResponseStatus(event, 401);
        return createErrorResponse("AUTH_UNAUTHORIZED", "\u767B\u5F55\u72B6\u6001\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55");
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
      return createSuccessResponse(sanitizeUser(user));
    } catch (error) {
      setResponseStatus(event, 500);
      return createErrorResponse("INTERNAL_SERVER_ERROR", "\u670D\u52A1\u5668\u5F00\u5C0F\u5DEE\u4E86\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5");
    }
  }
);

export { profile_get as default };
//# sourceMappingURL=profile.get.mjs.map
