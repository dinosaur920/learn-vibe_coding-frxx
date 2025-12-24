import { c as defineEventHandler, e as setResponseStatus, r as readBody } from '../../../_/nitro.mjs';
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

function sanitizePlot(plot) {
  return {
    id: plot.id,
    slotIndex: plot.slotIndex,
    status: plot.status,
    herbId: plot.herbId,
    plantedAt: plot.plantedAt ? plot.plantedAt.toISOString() : null
  };
}
const harvest_post = defineEventHandler(async (event) => {
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
    const body = await readBody(event);
    const slotIndex = typeof body.slotIndex === "number" ? body.slotIndex : NaN;
    if (!Number.isInteger(slotIndex) || slotIndex < 0) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "VALIDATION_ERROR",
        "\u8BF7\u9009\u62E9\u8981\u6536\u83B7\u7684\u5730\u5757"
      );
    }
    const plot = await prisma.cavePlot.findFirst({
      where: {
        userId: payload.userId,
        slotIndex
      }
    });
    if (!plot) {
      setResponseStatus(event, 404);
      return createErrorResponse(
        "CAVE_INVALID_SLOT",
        "\u8BF7\u9009\u62E9\u6709\u6548\u7684\u836F\u56ED\u5730\u5757"
      );
    }
    if (plot.status === CavePlotStatus.EMPTY || !plot.herbId || !plot.plantedAt) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "CAVE_SLOT_EMPTY",
        "\u8BE5\u5730\u5757\u5F53\u524D\u6CA1\u6709\u53EF\u6536\u83B7\u7684\u7075\u8349"
      );
    }
    const herbConfig = getHerbConfigById(plot.herbId);
    if (!herbConfig) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "CAVE_INVALID_HERB",
        "\u8BE5\u5730\u5757\u7684\u7075\u8349\u4FE1\u606F\u5F02\u5E38"
      );
    }
    const now = /* @__PURE__ */ new Date();
    const matureTime = plot.plantedAt.getTime() + herbConfig.matureSeconds * 1e3;
    if (now.getTime() < matureTime) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "CAVE_NOT_READY",
        "\u7075\u8349\u5C1A\u672A\u6210\u719F\uFF0C\u6682\u65F6\u65E0\u6CD5\u6536\u83B7"
      );
    }
    const updatedPlot = await prisma.cavePlot.update({
      where: {
        id: plot.id
      },
      data: {
        status: CavePlotStatus.EMPTY,
        herbId: null,
        plantedAt: null
      }
    });
    const result = {
      plot: sanitizePlot(updatedPlot),
      harvest: {
        herbId: herbConfig.id,
        herbName: herbConfig.name
      }
    };
    return createSuccessResponse(result);
  } catch (error) {
    setResponseStatus(event, 500);
    return createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      "\u670D\u52A1\u5668\u5F00\u5C0F\u5DEE\u4E86\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5"
    );
  }
});

export { harvest_post as default };
//# sourceMappingURL=harvest.post.mjs.map
