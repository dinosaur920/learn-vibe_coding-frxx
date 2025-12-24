import { c as defineEventHandler, r as readBody, e as setResponseStatus } from '../../../_/nitro.mjs';
import { c as createErrorResponse, p as prisma, b as verifyPassword, s as signAuthToken, d as setAuthCookie, a as createSuccessResponse } from '../../../_/auth.mjs';
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
const login_post = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const body = await readBody(event);
    const username = (_a = body.username) == null ? void 0 : _a.trim();
    const password = (_b = body.password) == null ? void 0 : _b.trim();
    if (!username || !password) {
      setResponseStatus(event, 400);
      return createErrorResponse("VALIDATION_ERROR", "\u8BF7\u8F93\u5165\u8D26\u53F7\u548C\u5BC6\u7801");
    }
    const user = await prisma.user.findUnique({
      where: {
        username
      }
    });
    if (!user) {
      setResponseStatus(event, 401);
      return createErrorResponse("AUTH_INVALID_CREDENTIALS", "\u8D26\u53F7\u6216\u5BC6\u7801\u9519\u8BEF");
    }
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      setResponseStatus(event, 401);
      return createErrorResponse("AUTH_INVALID_CREDENTIALS", "\u8D26\u53F7\u6216\u5BC6\u7801\u9519\u8BEF");
    }
    const token = signAuthToken(user.id);
    setAuthCookie(event, token);
    return createSuccessResponse(sanitizeUser(user));
  } catch (error) {
    setResponseStatus(event, 500);
    return createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      "\u670D\u52A1\u5668\u5F00\u5C0F\u5DEE\u4E86\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5"
    );
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
