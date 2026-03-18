# Monthly Report (Phase 1)

## Normalization Rules

1. **Status**
   - Synonyms are normalized to: `agendada`, `liberada`, `em_execucao`, `encerramento`,
     `concluida`, `backlog`, `cancelada`.
   - Unknown values are coerced to `unknown` and flagged.

2. **Dates / Timezone**
   - Date-only fields (e.g. `dueDate`, `rdoDate`) are parsed as local dates (`YYYY-MM-DD`).
   - Datetime fields (e.g. `doneAt`, `createdAt`) accept ISO strings and are parsed with JS `Date`.
   - Normalized output includes both `Date` objects and ISO strings.

3. **IDs**
   - Missing IDs receive a synthetic `synthetic_<hash>` id.
   - Duplicate IDs are disambiguated with `__dupN`.

4. **Docs**
   - Required docs are derived from activity category or critical flag.
   - Status outcomes: `ok`, `partial`, `missing`, `unknown`, `not_required`.
   - `unknown` is used when requirements are not determinable or data is missing.

5. **Validity**
   - Activities without `status` or without both `dueDate` and `doneAt` are flagged as invalid.
   - Invalid records are kept but excluded from aggregation.

6. **Sanitization Metadata**
   - Normalizer returns warning list and counts for invalid records, docs stats, and schema errors.

## Aggregation Scopes

1. **Planned set**
   - Activities with `dueDate` inside the reporting period.
   - Used for status breakdowns and `totalPlannedActivities`.

2. **Executed set**
   - Activities with `doneAt` inside the reporting period and `status == concluida`.
   - Used for `totalExecutedActivities`, SLA, docs compliance and hours.

## Output

- Aggregator outputs `current` and optional `previous` summaries with metrics and breakdowns.
- Traceability map is included for each KPI.
