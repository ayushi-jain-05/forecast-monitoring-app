import type { ActualRow, ForecastRow, ChartDataPoint } from "./types";

const MS_PER_HOUR = 60 * 60 * 1000;

/**
 * For a given target time, select the latest forecast that was published
 * at least `horizonHours` before the target time.
 * publishTime <= targetTime - horizonHours
 */
export function selectLatestForecast(
  targetTime: string,
  forecasts: ForecastRow[],
  horizonHours: number
): ForecastRow | null {
  const targetMs = new Date(targetTime).getTime();
  const cutoffMs = targetMs - horizonHours * MS_PER_HOUR;

  const valid = forecasts.filter((f) => {
    const sameTarget = new Date(f.startTime).getTime() === targetMs;
    const publishedBeforeCutoff = new Date(f.publishTime).getTime() <= cutoffMs;
    return sameTarget && publishedBeforeCutoff;
  });

  if (valid.length === 0) return null;

  valid.sort(
    (a, b) =>
      new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
  );
  return valid[0];
}

/**
 * Filter forecasts to those with startTime in Jan 2024 and
 * forecast horizon (startTime - publishTime) between 0 and 48 hours.
 */
export function filterForecastsJan2024Horizon048(
  forecasts: ForecastRow[]
): ForecastRow[] {
  const janStart = new Date("2024-01-01T00:00:00Z").getTime();
  const janEnd = new Date("2024-02-01T00:00:00Z").getTime();

  return forecasts.filter((f) => {
    const startMs = new Date(f.startTime).getTime();
    if (startMs < janStart || startMs >= janEnd) return false;
    const publishMs = new Date(f.publishTime).getTime();
    const horizonHours = (startMs - publishMs) / MS_PER_HOUR;
    return horizonHours >= 0 && horizonHours <= 48;
  });
}

/**
 * Merge actuals with selected forecasts per target time.
 * Missing forecasts are omitted (no point plotted for forecast).
 */
export function mergeActualAndForecast(
  actuals: ActualRow[],
  forecasts: ForecastRow[],
  horizonHours: number
): ChartDataPoint[] {
  const result: ChartDataPoint[] = [];

  for (const actual of actuals) {
    const forecast = selectLatestForecast(
      actual.startTime,
      forecasts,
      horizonHours
    );
    const forecastVal = forecast ? forecast.generation : null;
    result.push({
      time: actual.startTime,
      actual: actual.generation,
      forecast: forecastVal,
      error:
        forecastVal != null ? actual.generation - forecastVal : undefined,
    });
  }

  return result.sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );
}
