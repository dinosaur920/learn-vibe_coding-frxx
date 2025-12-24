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

type PlantBody = {
  slotIndex?: number;
  herbId?: string;
};

type PlantResult = {
  plot: {
    id: number;
    slotIndex: number;
    status: string;
    herbId: string | null;
    plantedAt: string | null;
  };
};

function sanitizePlot(plot: CavePlot): PlantResult["plot"] {
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

    const body = await readBody<PlantBody>(event);
    const slotIndex =
      typeof body.slotIndex === "number" ? body.slotIndex : NaN;
    const herbId = body.herbId;

    if (
      !Number.isInteger(slotIndex) ||
      slotIndex < 0 ||
      !herbId ||
      typeof herbId !== "string"
    ) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "VALIDATION_ERROR",
        "请选择要种植的地块和灵草"
      );
    }

    const herbConfig = getHerbConfigById(herbId);

    if (!herbConfig) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "CAVE_INVALID_HERB",
        "选择的灵草不存在"
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

    if (plot.status !== CavePlotStatus.EMPTY) {
      setResponseStatus(event, 400);
      return createErrorResponse(
        "CAVE_SLOT_NOT_EMPTY",
        "该地块当前不可种植"
      );
    }

    const now = new Date();

    const updatedPlot = await prisma.cavePlot.update({
      where: {
        id: plot.id,
      },
      data: {
        status: CavePlotStatus.GROWING,
        herbId: herbConfig.id,
        plantedAt: now,
      },
    });

    const result: PlantResult = {
      plot: sanitizePlot(updatedPlot),
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

