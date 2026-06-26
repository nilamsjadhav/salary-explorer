# Salary Explorer — Refactoring History
---

## 1. Key Refactoring Decisions

Over the course of development, the codebase underwent structured refactoring passes with clear principles:

1. **useApiData hook** — Extracted common `loading/error/data` fetch pattern from 5 components into one reusable hook. Params: `fetchFn` (returns promise), `deps` array. Returns `{ data, loading, error, refetch }`.

2. **LoadingSpinner + ErrorAlert** — Replaced duplicated loading/error JSX across 6 components with shared components. Ensures consistent UX for all loading and error states.

3. **FilterPanel extraction** — Split EmployeeTable (210 lines) into FilterPanel component + useEmployeeFilters hook (~120 lines). Separates presentation (FilterPanel) from state management (hook).

4. **buildUrl utility** — Created URL builder to DRY up query parameter construction in the API service layer. Handles undefined/null values automatically.

5. **ReportTable component** — Extracted a configurable table component from ReportsSection, removing ~100 lines of duplicated table markup. Takes column definitions with optional custom render functions.

6. **buildWhereClause utility** (server) — Extracted identical country filter logic from 3 report service functions into a shared SQL where-clause builder. Accepts a `filters` object, returns `{ clause, params }`.

7. **Constants extraction** — Moved shared table styles and country lists to dedicated constant modules. Single source of truth.

8. **ErrorBoundary** — Added React error boundary wrapping the main tab layout to catch and display runtime crashes gracefully instead of blank screens.
