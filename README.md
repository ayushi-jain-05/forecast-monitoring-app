# UK Wind Forecast Monitoring App

A full-stack challenge submission: a **forecast monitoring app** (Next.js) and **Jupyter analysis** of UK wind power forecasts and actual generation (January 2024).

## What’s in this repo

| Path | Description |
|------|-------------|
| `src/app/` | Next.js App Router: main page, layout, global styles |
| `src/app/api/wind-data/` | API route that fetches Elexon data and returns merged actual vs forecast series |
| `src/components/` | UI: date range picker, horizon slider, Recharts line chart |
| `src/lib/` | Data fetching (FUELHH, WINDFOR) and forecast selection logic |
| `notebooks/analysis.ipynb` | Jupyter notebook: forecast error metrics, error by horizon & time of day, wind reliability and recommendation |

## Data and logic

- **Actual generation:** Elexon BMRS [FUELHH](https://data.elexon.co.uk/bmrs/api/v1) stream, `fuelType=WIND`, 30‑min resolution (`startTime`, `generation`).
- **Forecasts:** [WINDFOR](https://data.elexon.co.uk/bmrs/api/v1) stream (`startTime`, `publishTime`, `generation`). Only January 2024; horizon 0–48 hours.
- **Forecast rule:** For each target time, the app uses the **latest forecast whose `publishTime` is at least `horizon` hours before the target**. Example: target 24/05/24 18:00, horizon 4h → use latest forecast published before 24/05/24 14:00.

Missing forecasts for a given target are skipped (no forecast point plotted).

## How to run the app

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000).
4. Choose **Start time** and **End time** (Jan 2024), set **Forecast horizon** (0–48 hours), then click **Load chart** to see actual (blue) vs forecast (green) and MAE.

Build for production:
```bash
npm run build
npm start
```

## Deployed (Vercel)

**Live app link:** *https://forecast-monitoring-app.vercel.app/*

## Running the analysis notebook

1. Create a virtual environment and install:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate   # Windows
   pip install pandas numpy matplotlib seaborn requests jupyter
   ```
2. Start Jupyter:
   ```bash
   jupyter notebook notebooks/analysis.ipynb
   ```
3. Run all cells. The notebook fetches data from the Elexon APIs and computes:
   - Error statistics (mean, median, p99, MAE, RMSE)
   - MAE vs forecast horizon (0, 4, 12, 24, 48 h)
   - Error by time of day
   - Distribution of actual wind generation and a **recommendation** for how many MW can be reliably expected (P10/P25-based).

## Tech stack

- **App:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts.
- **Analysis:** Python, pandas, matplotlib, seaborn, requests.

## AI tools

This project was built with assistance from AI tools (e.g. Cursor). The analysis conclusions and recommendation in the notebook are human-directed; AI was used for implementation and low-level help.

## License

MIT.
