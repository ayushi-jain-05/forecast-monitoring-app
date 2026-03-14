"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { ChartDataPoint } from "@/lib/types";

interface ForecastChartProps {
  data: ChartDataPoint[];
  loading?: boolean;
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function ForecastChart({ data, loading }: ForecastChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    name: formatTime(d.time),
    fullTime: d.time,
  }));

  const withForecast = chartData.filter((d) => d.forecast != null);
  const mae =
    withForecast.length > 0
      ? withForecast.reduce((s, d) => s + Math.abs((d.error ?? 0)), 0) /
        withForecast.length
      : null;

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-slate-500">Loading chart data…</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-slate-500">No data for the selected range.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <div className="h-[400px] w-full rounded-xl border border-slate-200 bg-white p-2 sm:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              tickFormatter={(v, i) =>
                i % Math.max(1, Math.floor(chartData.length / 8)) === 0
                  ? v
                  : ""
              }
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: "MW",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 12 },
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload;
                return (
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                    <p className="text-xs text-slate-500">
                      {formatTime(p.fullTime)}
                    </p>
                    <p className="text-sm text-blue-600">
                      Actual: {p.actual.toFixed(0)} MW
                    </p>
                    {p.forecast != null && (
                      <>
                        <p className="text-sm text-green-600">
                          Forecast: {p.forecast.toFixed(0)} MW
                        </p>
                        <p className="text-sm text-slate-700">
                          Error: {(p.actual - p.forecast).toFixed(0)} MW
                        </p>
                      </>
                    )}
                  </div>
                );
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual generation"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="forecast"
              name="Forecast generation"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            {mae != null && (
              <ReferenceLine
                y={mae}
                stroke="#94a3b8"
                strokeDasharray="4 4"
                label={{ value: `MAE ≈ ${mae.toFixed(0)} MW`, position: "right" }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {mae != null && (
        <p className="text-sm text-slate-600">
          Mean absolute error (MAE): <strong>{mae.toFixed(0)} MW</strong>
        </p>
      )}
    </div>
  );
}
