"use client";

interface HorizonSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function HorizonSlider({
  value,
  onChange,
  disabled,
}: HorizonSliderProps) {
  return (
    <div className="w-full max-w-md">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-600">
          Forecast horizon (hours): {value}
        </span>
        <input
          type="range"
          min={0}
          max={48}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600 disabled:opacity-50"
        />
      </label>
    </div>
  );
}
