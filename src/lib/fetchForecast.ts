import { ELEXON_BASE } from "./types";
import type { ForecastRow } from "./types";

/**
 * Fetch wind generation forecast from WINDFOR stream.
 * Uses publish time range to get historical forecasts for Jan 2024.
 */
export async function fetchForecastGeneration(
  publishFrom: string,
  publishTo: string
): Promise<ForecastRow[]> {
  const url = new URL(`${ELEXON_BASE}/datasets/WINDFOR/stream`);
  url.searchParams.set("publishDateTimeFrom", publishFrom);
  url.searchParams.set("publishDateTimeTo", publishTo);

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`WINDFOR API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as unknown[];
  if (!Array.isArray(data)) return [];

  return data.map(normalizeForecastRow);
}

function normalizeForecastRow(row: Record<string, unknown>): ForecastRow {
  const startTime =
    (row.startTime as string) ??
    (row.settlementStartTime as string) ??
    "";
  const publishTime =
    (row.publishTime as string) ??
    (row.publishDateTime as string) ??
    "";
  const generation =
    typeof row.generation === "number"
      ? row.generation
      : typeof row.quantity === "number"
        ? row.quantity
        : 0;
  return { startTime, publishTime, generation };
}
