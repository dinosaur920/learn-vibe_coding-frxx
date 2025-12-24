import { c as defineEventHandler, e as setResponseStatus } from '../../../_/nitro.mjs';
import { g as getTokenFromRequest, c as createErrorResponse, v as verifyAuthToken, p as prisma, a as createSuccessResponse } from '../../../_/auth.mjs';
import { C as CavePlotStatus, g as getHerbConfigById } from '../../../_/gameConstants.mjs';
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

function toCavePlotDto(plot, now) {
  const herbConfig = plot.herbId ? getHerbConfigById(plot.herbId) : null;
  let plantedAt = null;
  let matureAt = null;
  let isMature = false;
  if (plot.plantedAt && herbConfig) {
    plantedAt = plot.plantedAt.toISOString();
    const matureTime = plot.plantedAt.getTime() + herbConfig.matureSeconds * 1e3;
    matureAt = new Date(matureTime).toISOString();
    isMature = now.getTime() >= matureTime;
  }
  return {
    id: plot.id,
    slotIndex: plot.slotIndex,
    status: plot.status,
    herbId: plot.herbId,
    herbName: herbConfig ? herbConfig.name : null,
    plantedAt,
    matureAt,
    isMature
  };
}
const status_get = defineEventHandler(async (event) => {
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
    let plots = await prisma.cavePlot.findMany({
      where: {
        userId: payload.userId
      },
      orderBy: {
        slotIndex: "asc"
      }
    });
    if (plots.length === 0) {
      const slotCount = 4;
      const data2 = Array.from({ length: slotCount }).map((_, index) => ({
        userId: payload.userId,
        slotIndex: index,
        status: CavePlotStatus.EMPTY
      }));
      await prisma.cavePlot.createMany({
        data: data2
      });
      plots = await prisma.cavePlot.findMany({
        where: {
          userId: payload.userId
        },
        orderBy: {
          slotIndex: "asc"
        }
      });
    }
    const now = /* @__PURE__ */ new Date();
    const data = plots.map((plot) => toCavePlotDto(plot, now));
    return createSuccessResponse({
      plots: data
    });
  } catch (error) {
    setResponseStatus(event, 500);
    return createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      "\u670D\u52A1\u5668\u5F00\u5C0F\u5DEE\u4E86\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5"
    );
  }
});

export { status_get as default };
//# sourceMappingURL=status.get.mjs.map
