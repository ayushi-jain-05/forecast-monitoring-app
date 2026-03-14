"use client";

import { JAN_2024_START, JAN_2024_END } from "@/lib/types";

interface DateRangePickerProps {
  start: string;
  end: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  disabled?: boolean;
}

export function DateRangePicker({
  start,
  end,
  onStartChange,
  onEndChange,
  disabled,
}: DateRangePickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">
          Start time
        </span>
        <input
          type="date"
          min={JAN_2024_START}
          max={JAN_2024_END}
          value={start}
          onChange={(e) => onStartChange(e.target.value)}
          disabled={disabled}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">
          End time
        </span>
        <input
          type="date"
          min={JAN_2024_START}
          max={JAN_2024_END}
          value={end}
          onChange={(e) => onEndChange(e.target.value)}
          disabled={disabled}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
        />
      </label>
    </div>
  );
}
