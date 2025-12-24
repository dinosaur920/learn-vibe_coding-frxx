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
import { CavePlotStatus, getHerbConfigById } from "~/utils/gameConstants";

type CavePlotDto = {
  id: number;
  slotIndex: number;
  status: string;
  herbId: string | null;
  herbName: string | null;
  plantedAt: string | null;
  matureAt: string | null;
  isMature: boolean;
};

function toCavePlotDto(plot: CavePlot, now: Date): CavePlotDto {
  const herbConfig = plot.herbId ? getHerbConfigById(plot.herbId) : null;

  let plantedAt: string | null = null;
  let matureAt: string | null = null;
  let isMature = false;

  if (plot.plantedAt && herbConfig) {
    plantedAt = plot.plantedAt.toISOString();
    const matureTime =
      plot.plantedAt.getTime() + herbConfig.matureSeconds * 1000;
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
    isMature,
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

    let plots = await prisma.cavePlot.findMany({
      where: {
        userId: payload.userId,
      },
      orderBy: {
        slotIndex: "asc",
      },
    });

    if (plots.length === 0) {
      const slotCount = 4;
      const data = Array.from({ length: slotCount }).map((_, index) => ({
        userId: payload.userId,
        slotIndex: index,
        status: CavePlotStatus.EMPTY,
      }));

      await prisma.cavePlot.createMany({
        data,
      });

      plots = await prisma.cavePlot.findMany({
        where: {
          userId: payload.userId,
        },
        orderBy: {
          slotIndex: "asc",
        },
      });
    }

    const now = new Date();
    const data = plots.map((plot) => toCavePlotDto(plot, now));

    return createSuccessResponse({
      plots: data,
    });
  } catch (error) {
    setResponseStatus(event, 500);
    return createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      "服务器开小差了，请稍后重试"
    );
  }
});
