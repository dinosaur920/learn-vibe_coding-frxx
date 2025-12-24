import { prisma } from "~/server/utils/prisma";
import {
  createErrorResponse,
  createSuccessResponse,
} from "~/server/utils/response";
import {
  getTokenFromRequest,
  verifyAuthToken,
} from "~/server/utils/auth";
import { setResponseStatus } from "h3";
import type { CavePlot } from "@prisma/client";
import {
  CavePlotStatus,
  getHerbConfigById,
} from "~/utils/gameConstants";

type HarvestBody = {
  slotIndex?: number;
};

type HarvestResult = {
  plot: {
    id: number;
    slotIndex: number;
    status: string;
    herbId: string | null;
    plantedAt: string | null;
  };
  harvest: {
    herbId: string;
    herbName: string;
  };
};

function sanitizePlot(plot: CavePlot): HarvestResult["plot"] {
  return {
    id: plot.id,
    slotIndex: plot.slotIndex,
    status: plot.status,
    herbId: plot.herbId,
    plantedAt: plot.plantedAt ? plot.plantedAt.toISOString() : null,
  };
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

    const body = await readBody<HarvestBody>(event);
    const slotIndex =
      typeof body.slotIndex === "number" ? body.slotIndex : NaN;

    if (!Number.isInteger(slotIndex) || slotIndex < 0) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "VALIDATION_ERROR",
        "请选择要收获的地块"
      );
    }

    const plot = await prisma.cavePlot.findFirst({
      where: {
        userId: payload.userId,
        slotIndex,
      },
    });

    if (!plot) {
      setResponseStatus(event, 404);
      return createErrorResponse(
        "CAVE_INVALID_SLOT",
        "请选择有效的药园地块"
      );
    }

    if (
      plot.status === CavePlotStatus.EMPTY ||
      !plot.herbId ||
      !plot.plantedAt
    ) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "CAVE_SLOT_EMPTY",
        "该地块当前没有可收获的灵草"
      );
    }

    const herbConfig = getHerbConfigById(plot.herbId);

    if (!herbConfig) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "CAVE_INVALID_HERB",
        "该地块的灵草信息异常"
      );
    }

    const now = new Date();
    const matureTime =
      plot.plantedAt.getTime() + herbConfig.matureSeconds * 1000;

    if (now.getTime() < matureTime) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "CAVE_NOT_READY",
        "灵草尚未成熟，暂时无法收获"
      );
    }

    const updatedPlot = await prisma.cavePlot.update({
      where: {
        id: plot.id,
      },
      data: {
        status: CavePlotStatus.EMPTY,
        herbId: null,
        plantedAt: null,
      },
    });

    const result: HarvestResult = {
      plot: sanitizePlot(updatedPlot),
      harvest: {
        herbId: herbConfig.id,
        herbName: herbConfig.name,
      },
    };

    return createSuccessResponse(result);
  } catch (error) {
    setResponseStatus(event, 500);
    return createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      "服务器开小差了，请稍后重试"
    );
  }
});

