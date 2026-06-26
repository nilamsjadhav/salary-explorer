# Salary Explorer — Requirements Document

---

## Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System architecture, diagrams, directory structure, API reference
- [DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md) — Trade-offs, performance considerations, design rationale
- [AI_DEVELOPMENT.md](./AI_DEVELOPMENT.md) — AI prompts, interaction principles, testing strategy
- [REFACTORING.md](./REFACTORING.md) — Refactoring log, decisions, and lines-of-duplication removed

---

## 1. Goal

Build a **Salary Explorer** application that enables HR users to analyze employee compensation data through an intuitive web interface. The application provides:

- **Employee data exploration** — search, filter, and paginate through employee records
- **Salary-based filtering** — narrow down by salary range, currency, joining date
- **Interactive dashboards** — KPI cards, department breakdowns, salary distribution charts
- **Compensation analytics** — pre-built reports for top earners, department averages, and payroll distribution

The application targets a dataset of **10,000 employee records** across multiple countries, departments, and currencies, giving HR teams actionable insights into salary trends without requiring complex query skills.

---

## 2. Scope & Features

### Feature 1: Data Explorer (Workforce Overview)

The Workforce Overview tab provides a full-featured employee data table with search, filtering, and pagination.

| Capability | Description | Implementation |
|---|---|---|
| View all employees | Paginated tabular view of employee records | Server-side pagination (LIMIT/OFFSET) |
| Search | Text search across name, ID, designation, location, country | Server-side SQL LIKE with debounced input (300ms) |
| Salary filter | Min/max salary range to narrow records | Server-side WHERE clauses |
| Currency filter | Filter by employee's salary currency | Server-side exact match |
| Date range filter | Filter employees by joining date range | Server-side date comparison |
| Pagination | Configurable page size (default: 20, max: 100) | Server-side with total count |
| Department badges | Color-coded department chips per row | Client-side MUI Chip component |

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Filters (Paper with FilterListIcon header)                 │
│  ┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Search       │ │ From Date│ │ To Date  │ │ Currency ▼│  │
│  └──────────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌──────────────┐ ┌──────────┐                              │
│  │ Min Salary   │ │ Max Salary│                             │
│  └──────────────┘ └──────────┘                              │
├─────────────────────────────────────────────────────────────┤
│  Employee Table (compact rows, styled headers)              │
│  ID | Name | Department | Designation | Location | ...      │
│  ─────────────────────────────────────────────────────────  │
│  E001 | Alice Sharma | [Engineering] | SDE-II | Mumbai | ..│
│  E002 | Bob Patel    | [Finance]     | Analyst | Delhi | .. │
├─────────────────────────────────────────────────────────────┤
│  ◀ Page 1 of 500 ▶     Rows per page: [20 ▼]               │
└─────────────────────────────────────────────────────────────┘
```

### Feature 2: Dashboard

The Dashboard tab provides high-level compensation metrics and interactive visualizations.

**KPI Cards** (currency-aware, displayed as colored chips):
- Average Salary
- Highest Salary
- Lowest Salary
- Total Payroll

**Charts:**
- **Employees by Department** — horizontal bar chart showing headcount per department, with unique color per bar
- **Salary Distribution** — vertical bar chart showing employee count across 4 auto-calculated salary buckets (e.g., "72K-2.4M", "2.4M-4.8M", etc.), with angled x-axis labels for readability

**Dashboard Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  KPI Cards                              [Currency: INR ▼]   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Avg: ₹2.1M│ │ High:₹9.5M│ │ Low: ₹72K│ │Total: ₹25.3M│  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Charts                                                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Employees by Department (horizontal bar chart)      │   │
│  │  Engineering ████████████████ 15                     │   │
│  │  Sales       ████████████ 12                         │   │
│  │  Finance     ████████ 8                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Salary Distribution       [Currency: INR ▼]         │   │
│  │       █                                              │   │
│  │   █   █           █                                  │   │
│  │   █   █     █     █                                  │   │
│  │  72K-2.4M 2.4-4.8M 4.8-7.2M 7.2M+                  │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Reports & Analytics                     [Country: All ▼]   │
│  (See Feature 3 below)                                      │
└─────────────────────────────────────────────────────────────┘
```

### Feature 3: Reports & Analytics

Pre-built HR reports displayed on the Dashboard tab with a country filter for drill-down analysis.

| Report | Description | Data Points |
|---|---|---|
| Top 5 Highest Paid | Ranked table of highest earners | Name, Department, Country, Salary, Currency |
| Average Salary by Department | Department-wise salary averages | Department, Avg Salary, Currency |
| Payroll by Department | Total department payroll and headcount | Department, Total Payroll, Employee Count, Currency |

All three reports share a single country filter dropdown to ensure consistent drill-down context. They are fetched via a single API call to reduce network overhead.

---

## 3. What We're Deliberately Leaving Out

| Feature | Reason |
|---|---|
| **Suggested Questions** (NLP-style "Try asking...") | Doesn't add functionality beyond what Reports already provides. The three pre-built reports cover the most common HR questions. Adding NLP adds complexity without proportional value. |
| **Export Results** (CSV/PDF) | Dependent on having mature data views and filters. Current focus is on building and validating the analytical interface first. Export is a low-effort addition once views are stable. |
| **Import Data** | Seeded dataset serves development and demo needs. Import adds file parsing, validation, duplicate detection, and error handling — significant CRUD complexity with no analytics value. |
| **Employee Management** (Add/Edit/Delete) | Application is a read-only analytics tool. Write operations add form validation, optimistic updates, and data integrity concerns that are out of scope. |
| **Authentication & Authorization** | Single-user demo application. Auth adds token management, session handling, role-based access — complexity without value for current scope. |

---

## 4. Functional Requirements

### Data Explorer Requirements
- FR-1: The system shall display employee information in a paginated table with server-side pagination.
- FR-2: The system shall allow searching employees across name, employee ID, designation, location, and country fields.
- FR-3: The system shall allow filtering by salary range (min/max), currency, and joining date range.
- FR-4: The system shall debounce filter changes by 300ms to avoid excessive API calls, with immediate fetch on first load.
- FR-5: The system shall display department as a color-coded chip for visual distinction.
- FR-6: The system shall format salaries using locale-aware currency formatting (e.g., ₹25,00,000 for INR, $250,000 for USD).

### Dashboard Requirements
- FR-7: The system shall display four KPI cards (Average, Highest, Lowest Salary, Total Payroll) filterable by currency.
- FR-8: The system shall display an Employees by Department horizontal bar chart with unique colors per department.
- FR-9: The system shall display a Salary Distribution histogram with auto-calculated range buckets, filterable by currency.
- FR-10: The system shall display salary distribution x-axis labels at an angle to prevent text overlap.

### Reports Requirements
- FR-11: The system shall provide Top 5 Highest Paid, Average Salary by Department, and Payroll by Department reports.
- FR-12: The system shall allow filtering all reports by country via a single shared dropdown.
- FR-13: The system shall show "No data available" when a report has no matching records for the selected country.

### Non-Functional Requirements
- NFR-1: The system shall serve both API and React frontend from a single Express server (single-port deployment).
- NFR-2: The system shall use WAL journal mode for SQLite to support concurrent reads.
- NFR-3: The system shall auto-generate seed data on first startup if no data file exists.
- NFR-4: The system shall provide a health check endpoint at `/healthz` returning uptime and status.
- NFR-5: The system shall handle API errors gracefully with user-friendly error messages and an ErrorBoundary for React crashes.
