// Types for Elexon BMRS API responses and app data

export interface ActualRow {
  startTime: string;
  generation: number;
  /** API may use different keys */
  settlementStartTime?: string;
  quantity?: number;
}

export interface ForecastRow {
  startTime: string;
  publishTime: string;
  generation: number;
  publishDateTime?: string;
  settlementStartTime?: string;
  quantity?: number;
}

export interface ChartDataPoint {
  time: string;
  actual: number;
  forecast: number | null;
  error?: number;
}

export const JAN_2024_START = "2024-01-01";
export const JAN_2024_END = "2024-01-31";
export const ELEXON_BASE = "https://data.elexon.co.uk/bmrs/api/v1";
