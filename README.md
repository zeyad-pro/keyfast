# TypeTrack — 30 Day Typing Progress

A Vite + React + TypeScript + Tailwind CSS + Recharts dashboard for tracking typing speed and accuracy over 30 calendar days.

## Run

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Behavior

- Day 1 starts at 26 WPM / 95% accuracy.
- The day number is calculated from the stored start date.
- The form uses a real calendar date; it does not create a row for a missing day.
- Only dates with recorded results appear in the chart and table.
- One result per calendar date.
- Data persists in `localStorage`.
- Edit and delete are supported.
- CSV and JSON exports are included.
- The chart has separate WPM and accuracy axes and a 26 WPM baseline.
