import { c as defineEventHandler, e as setResponseStatus, r as readBody } from '../../../_/nitro.mjs';
import { g as getTokenFromRequest, c as createErrorResponse, v as verifyAuthToken, p as prisma, a as createSuccessResponse } from '../../../_/auth.mjs';
import { g as getHerbConfigById, C as CavePlotStatus } from '../../../_/gameConstants.mjs';
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
const plant_post = defineEventHandler(async (event) => {
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
    const herbId = body.herbId;
    if (!Number.isInteger(slotIndex) || slotIndex < 0 || !herbId || typeof herbId !== "string") {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "VALIDATION_ERROR",
        "\u8BF7\u9009\u62E9\u8981\u79CD\u690D\u7684\u5730\u5757\u548C\u7075\u8349"
      );
    }
    const herbConfig = getHerbConfigById(herbId);
    if (!herbConfig) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "CAVE_INVALID_HERB",
        "\u9009\u62E9\u7684\u7075\u8349\u4E0D\u5B58\u5728"
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
    if (plot.status !== CavePlotStatus.EMPTY) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "CAVE_SLOT_NOT_EMPTY",
        "\u8BE5\u5730\u5757\u5F53\u524D\u4E0D\u53EF\u79CD\u690D"
      );
    }
    const now = /* @__PURE__ */ new Date();
    const updatedPlot = await prisma.cavePlot.update({
      where: {
        id: plot.id
      },
      data: {
        status: CavePlotStatus.GROWING,
        herbId: herbConfig.id,
        plantedAt: now
      }
    });
    const result = {
      plot: sanitizePlot(updatedPlot)
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

export { plant_post as default };
//# sourceMappingURL=plant.post.mjs.map
