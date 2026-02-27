# Power BI Export (OPSCOPE)

## Overview
A manual export endpoint is available at:

`GET /api/powerbi/export`

The endpoint generates a ZIP with CSV files ready for Power BI import.

## Query params
- `source` (optional): module/page key (`kpis`, `manutencao`, `contingencias`, `auditoria`, `logs`, `uploads`, etc.)
- `from` (optional): `YYYY-MM-DD`
- `to` (optional): `YYYY-MM-DD`
- `filters` (optional): URL-encoded JSON with extra filters from current UI

Example:

`/api/powerbi/export?source=contingencias&from=2026-02-01&to=2026-02-29&filters=%7B%22status%22%3A%22NORMALIZED%22%7D`

## ZIP contents
- `facts_events.csv`
- `dim_dates.csv`
- `dim_users.csv`
- `dictionary.csv`
- `README.txt`

## Storage and data sources
The export is JSON-first and works without Postgres.

Main paths used by OPSCOPE backend:
- `OPSCOPE_DATA_DIR` (if configured)
- `OPSCOPE_STORAGE_DIR` (if configured)
- fallback: `%APPDATA%/opscope-storage`

If `DATABASE_URL`/`OPSCOPE_DATABASE_URL` is configured and available, export may append lightweight DB events from:
- `opscope_store`
- `opscope_uploads`

## Frontend usage
A reusable helper is available at:

`assets/js/powerbiExport.js`

Functions:
- `buildPowerBIExportUrl({ source, from, to, filters })`
- `attachPowerBIExportButton({ containerSelector, source, getFiltersFn })`

To enable export for a new panel:
1. Register source on backend (`POWERBI_SOURCE_REGISTRY` in `server.js`).
2. Register button on frontend (`setupPowerBIExportButtons` in `app.js`).

## Power BI import
1. Download and extract ZIP.
2. Open Power BI Desktop.
3. Home -> Get Data -> Folder.
4. Select extracted folder and load CSVs.
5. Create relationships:
   - `facts_events[date_key] -> dim_dates[date_key]`
   - `facts_events[user_id] -> dim_users[user_id]`
