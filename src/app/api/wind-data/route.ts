import { NextRequest } from "next/server";
import { fetchActualGeneration } from "@/lib/fetchActual";
import { fetchForecastGeneration } from "@/lib/fetchForecast";
import {
  filterForecastsJan2024Horizon048,
  mergeActualAndForecast,
} from "@/lib/forecastLogic";
import { JAN_2024_START, JAN_2024_END } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const start = searchParams.get("start") ?? JAN_2024_START;
  const end = searchParams.get("end") ?? JAN_2024_END;
  const horizon = Math.min(
    48,
    Math.max(0, Number(searchParams.get("horizon")) || 4)
  );

  // Clamp to January 2024
  const dateFrom =
    start < JAN_2024_START ? JAN_2024_START : start > JAN_2024_END ? JAN_2024_END : start;
  const dateTo =
    end > JAN_2024_END ? JAN_2024_END : end < JAN_2024_START ? JAN_2024_START : end;
  if (dateFrom > dateTo) {
    return Response.json(
      { error: "Invalid date range" },
      { status: 400 }
    );
  }

  try {
    const [actuals, forecastRaw] = await Promise.all([
      fetchActualGeneration(dateFrom, dateTo),
      fetchForecastGeneration(
        `${dateFrom}T00:00:00Z`,
        `${dateTo}T23:59:59Z`
      ),
    ]);

    const forecasts = filterForecastsJan2024Horizon048(forecastRaw);
    const chartData = mergeActualAndForecast(actuals, forecasts, horizon);

    return Response.json({
      data: chartData,
      meta: { start: dateFrom, end: dateTo, horizonHours: horizon },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch data";
    return Response.json({ error: message }, { status: 500 });
  }
}
