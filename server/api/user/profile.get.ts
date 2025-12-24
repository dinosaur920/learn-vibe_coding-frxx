import { prisma } from "~/server/utils/prisma"
import { createErrorResponse, createSuccessResponse } from "~/server/utils/response"
import { getTokenFromRequest, verifyAuthToken } from "~/server/utils/auth"
import { setResponseStatus } from "h3"
import type { User } from "@prisma/client"

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
    spiritRootLabel: user.spiritRootLabel
  }
}

export default defineEventHandler(async event => {
  try {
    const token = getTokenFromRequest(event)

    if (!token) {
      setResponseStatus(event, 401)
      return createErrorResponse("AUTH_UNAUTHORIZED", "请先登录")
    }

    const payload = verifyAuthToken(token)

    if (!payload || !payload.userId) {
      setResponseStatus(event, 401)
      return createErrorResponse("AUTH_UNAUTHORIZED", "登录状态已失效，请重新登录")
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId
      }
    })

    if (!user) {
      setResponseStatus(event, 404)
      return createErrorResponse("USER_NOT_FOUND", "用户不存在")
    }

    return createSuccessResponse(sanitizeUser(user))
  } catch (error) {
    setResponseStatus(event, 500)
    return createErrorResponse("INTERNAL_SERVER_ERROR", "服务器开小差了，请稍后重试")
  }
}
)
