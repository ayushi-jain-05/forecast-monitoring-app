"use client";

import { useState, useCallback, useMemo } from "react";
import { DateRangePicker } from "@/components/DateRangePicker";
import { HorizonSlider } from "@/components/HorizonSlider";
import { ForecastChart } from "@/components/ForecastChart";
import { mergeActualAndForecast } from "@/lib/forecastLogic";
import type { ChartDataPoint, ActualRow, ForecastRow } from "@/lib/types";
import { JAN_2024_START, JAN_2024_END } from "@/lib/types";

export default function Home() {
  const [start, setStart] = useState(JAN_2024_START);
  const [end, setEnd] = useState(JAN_2024_END);
  const [horizon, setHorizon] = useState(4);
  const [rawActuals, setRawActuals] = useState<ActualRow[]>([]);
  const [rawForecasts, setRawForecasts] = useState<ForecastRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        start,
        end,
        raw: "1",
      });
      const res = await fetch(`/api/wind-data?${params}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Request failed");
        setRawActuals([]);
        setRawForecasts([]);
        return;
      }
      setRawActuals(json.actuals ?? []);
      setRawForecasts(json.forecasts ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
      setRawActuals([]);
      setRawForecasts([]);
    } finally {
      setLoading(false);
    }
  }, [start, end]);

  const data = useMemo(
    () =>
      rawActuals.length > 0
        ? mergeActualAndForecast(rawActuals, rawForecasts, horizon)
        : [],
    [rawActuals, rawForecasts, horizon]
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          UK Wind Forecast Monitoring
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Compare actual vs forecasted wind power generation (January 2024)
        </p>
      </header>

      <section className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <DateRangePicker
          start={start}
          end={end}
          onStartChange={setStart}
          onEndChange={setEnd}
          disabled={loading}
        />
        <HorizonSlider
          value={horizon}
          onChange={setHorizon}
          disabled={loading}
        />
        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load chart"}
        </button>
      </section>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section>
        <ForecastChart data={data} loading={loading} />
      </section>

      <footer className="mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
        Data: Elexon BMRS (FUELHH, WINDFOR). Forecast horizon: use the latest
        forecast published at least N hours before each target time.
      </footer>
    </main>
  );
}
