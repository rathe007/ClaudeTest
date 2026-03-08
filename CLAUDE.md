# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EY "Auslastung" (utilization) viewer — a React app that parses Excel workload/capacity planning files and displays them as an interactive Gantt chart. The app is in German (EY branding, German UI labels and error messages).

## Commands

All commands run from the `auslastung/` directory:

- **Dev server:** `npm run dev`
- **Build:** `npm run build` (runs `tsc -b && vite build`)
- **Lint:** `npm run lint`
- **Preview production build:** `npm run preview`

The root `package.json` only has the `xlsx` dependency for Excel parsing; the actual app lives in `auslastung/`.

## Architecture

**Stack:** React 19 + TypeScript + Vite 7, no routing or state management library.

**Data flow:**
1. User uploads an Excel file (`.xlsx`) via `FileUpload` component
2. `excelParser.ts` reads two required sheets: `Auslastung_Prozent` and `Auslastung_Stunden`
3. Excel data is parsed into a hierarchy: **Team → Engagement → Employee** with weekly percent/hours data
4. `App.tsx` holds all state and applies filters (team, employee, engagement, search query)
5. `GanttChart` renders the filtered hierarchy with collapsible rows

**Key data model** (`src/types.ts`):
- `WeekColumn`: week header with date string key (e.g., "24.02.2025") and label
- `EngagementEntry`: single row with team, engagement, employee, notes, and `Map<string, WeekData>` keyed by week date string
- Data is grouped into `TeamGroup` → `EngagementGroup` → `EngagementEntry[]`

**Excel format expectations** (5 fixed columns):
1. Team, 2. Engagement ID, 3. Engagement Name, 4. Mitarbeiter (employee), 5. Notizen (notes)
- Remaining columns are weekly data with headers formatted as "dd.MM.yyyy\nMon Wn"

**Component hierarchy:**
- `App` → `FileUpload` | (`FilterBar` + `GanttChart`)
- `GanttChart` → `GanttHeader` + `TeamRow[]`
- `TeamRow` → `EngagementRow[]`
- `EngagementRow` → `EmployeeRow[]`
- `EmployeeRow` → `WeekCell[]`
