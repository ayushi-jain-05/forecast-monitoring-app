import { ELEXON_BASE } from "./types";
import type { ActualRow } from "./types";

/**
 * Fetch half-hourly wind generation outturn (actual) from FUELHH stream.
 * Filters for fuelType WIND and settlement date range.
 */
export async function fetchActualGeneration(
  dateFrom: string,
  dateTo: string
): Promise<ActualRow[]> {
  const url = new URL(`${ELEXON_BASE}/datasets/FUELHH/stream`);
  url.searchParams.set("settlementDateFrom", dateFrom);
  url.searchParams.set("settlementDateTo", dateTo);
  url.searchParams.set("fuelType", "WIND");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`FUELHH API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as unknown[];
  if (!Array.isArray(data)) return [];

  return data.map(normalizeActualRow);
}

function normalizeActualRow(row: Record<string, unknown>): ActualRow {
  const startTime =
    (row.startTime as string) ??
    (row.settlementStartTime as string) ??
    "";
  const generation =
    typeof row.generation === "number"
      ? row.generation
      : typeof row.quantity === "number"
        ? row.quantity
        : 0;
  return { startTime, generation };
}
