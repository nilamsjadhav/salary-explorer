# Salary Explorer — Architecture

---

## 1. High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      Render (Single Web Service)                 │
│                                                                  │
│   ┌─────────────────────────┐       ┌──────────────────────────┐ │
│   │    React Frontend       │       │    Express Backend        │ │
│   │    (Static Build)       │ HTTP  │                          │ │
│   │                         │──────▶│  Routes                  │ │
│   │  ┌───────────────────┐  │       │  ├── /api/employees      │ │
│   │  │ Workforce Overview│  │       │  ├── /api/dashboard      │ │
│   │  │ (EmployeeTable)   │  │       │  ├── /api/dashboard/     │ │
│   │  └───────────────────┘  │       │  │   departments         │ │
│   │  ┌───────────────────┐  │       │  │   salary-distribution │ │
│   │  │ Dashboard         │  │       │  │   reports             │ │
│   │  │ (KPIs + Charts +  │  │       │  └── /healthz            │ │
│   │  │  Reports)         │  │       │                          │ │
│   │  └───────────────────┘  │       │  Services                │ │
│   │                         │       │  └── employeeService.js  │ │
│   │  Middleware (api.js)    │       │                          │ │
│   │  Services               │       │  ┌────────────────────┐  │ │
│   │  Hooks | Utils          │       │  │  SQLite (WAL mode) │  │ │
│   │  Constants              │       │  │  better-sqlite3    │  │ │
│   └─────────────────────────┘       │  │  10,000 records    │  │ │
│                                     │  └────────────────────┘  │ │
│                                     └──────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Request-Response Data Flow

```
┌──────┐     ┌───────────┐     ┌──────────┐     ┌─────────┐     ┌─────────┐     ┌────────┐
│ User │────▶│  React    │────▶│  api.js  │────▶│ Express │────▶│ Service │────▶│ SQLite │
│Action│     │ Component │     │(middleware│     │  Route  │     │  Layer  │     │   DB   │
└──────┘     └───────────┘     └──────────┘     └─────────┘     └─────────┘     └────────┘
                  ▲                                                                  │
                  │              JSON Response                                       │
                  └──────────────────────────────────────────────────────────────────┘
```

**Detailed flow for a typical request (e.g., employee search):**

1. User types in SearchBar → triggers `onChange` handler
2. `useEmployeeFilters` hook updates `searchTerm` state
3. `useEffect` in EmployeeTable starts 300ms debounce timer
4. After debounce → `employeeService.getAll({ search, page, ... })` called
5. `buildUrl` constructs `/api/employees?search=xyz&page=1&pageSize=20`
6. `api.js` executes `fetch(url)`, handles errors via `ApiError` class
7. Express receives request → `getAllEmployees` route handler
8. Route delegates to `getEmployees(req.query)` service function
9. Service builds SQL WHERE clause, executes prepared statement
10. SQLite returns matching rows with LIMIT/OFFSET
11. Service returns `{ data, page, pageSize, totalRecords, totalPages }`
12. Response flows back → React updates table + pagination

---

## 3. Dependency Injection Pattern (Server)

```
server.js (composition root)
    │
    ├── reads config from config/index.js
    │   └── PORT, DB_PATH, DATA_PATH, EMPLOYEE_COUNT (env vars with defaults)
    │
    ├── checks if data file exists
    │   └── if not → runs seedGenerator.generate(count, path)
    │
    ├── initializes DB → getDb(config.dbPath)
    │   └── singleton: first call creates connection + schema, subsequent calls reuse
    │
    ├── seeds data → seed(config.dataPath)
    │   └── compares DB count vs file count, skips if already seeded
    │
    └── creates app → createApp()
        └── factory pattern: returns configured Express app (testable without server)
```

**Why this pattern?** The `createApp()` factory allows integration tests to create a fresh app instance without starting a real HTTP server. Config is centralized, and the DB path is injectable for test isolation.

---

## 4. Component Hierarchy (Frontend)

```
App
└── ErrorBoundary
    └── TabLayout
        ├── Tab 0: EmployeeTable
        │   ├── FilterPanel
        │   │   ├── SearchBar
        │   │   ├── DateRangeFilter
        │   │   └── SalaryFilter
        │   ├── Table (EmployeeRow × N)
        │   └── Pagination
        │
        └── Tab 1: Dashboard
            ├── KPI Chips (currency-filtered)
            ├── DepartmentChart
            ├── SalaryDistributionChart
            └── ReportsSection
                ├── Country Filter
                ├── ReportTable (Top 5)
                ├── ReportTable (Avg Salary)
                └── ReportTable (Payroll)
```

---

## 5. Backend Directory Structure

```
server/
├── src/
│   ├── server.js                 # Composition root — DI entry point
│   ├── app.js                    # Express app factory (createApp)
│   ├── config/
│   │   └── index.js              # Centralized config (env vars + defaults)
│   ├── database/
│   │   ├── db.js                 # SQLite connection (singleton + WAL)
│   │   ├── seed.js               # Data seeding with duplicate check
│   │   └── seedGenerator.js      # Realistic employee data generator
│   ├── routes/
│   │   ├── employees.js          # GET /api/employees handler
│   │   └── dashboard.js          # GET /api/dashboard/* handlers
│   ├── services/
│   │   └── employeeService.js    # Business logic (queries + aggregations)
│   ├── middleware/
│   │   └── errorHandler.js       # Centralized Express error handler
│   ├── utils/
│   │   ├── formatters.js         # Salary range label formatting
│   │   └── buildWhereClause.js   # Shared SQL WHERE clause builder
│   └── data/
│       └── employees.json        # Auto-generated seed dataset
├── tests/                        # Mirrors src/ structure
│   ├── app.test.js               # Route mounting + integration
│   ├── server.test.js            # Module export tests
│   ├── integration.test.js       # Full HTTP integration tests
│   ├── config/                   # Config module tests
│   ├── database/                 # DB, seed, generator tests
│   ├── middleware/               # Error handler tests
│   ├── routes/                   # Route handler unit tests
│   ├── services/                 # Service layer unit tests
│   └── utils/                    # Utility function tests
└── package.json
```

---

## 6. Frontend Directory Structure

```
client/
├── src/
│   ├── App.js                        # Root: AppBar + ErrorBoundary + TabLayout
│   ├── components/
│   │   ├── TabLayout.js              # Tab navigation (2 tabs, config-driven)
│   │   ├── TabPanel.js               # Tab panel wrapper
│   │   ├── EmployeeTable.js          # Data explorer with filters + pagination
│   │   ├── EmployeeRow.js            # Single employee row with department chip
│   │   ├── FilterPanel.js            # Styled filter section (Paper + icon header)
│   │   ├── SearchBar.js              # Text search input
│   │   ├── SalaryFilter.js           # Min/max salary inputs
│   │   ├── DateRangeFilter.js        # From/to date inputs
│   │   ├── Pagination.js             # Page navigation controls
│   │   ├── Dashboard.js              # KPIs + Charts + Reports composition
│   │   ├── DepartmentChart.js        # Horizontal bar chart (Recharts)
│   │   ├── SalaryDistributionChart.js # Vertical bar chart (Recharts)
│   │   ├── ReportsSection.js         # Reports composition (uses ReportTable)
│   │   ├── ReportTable.js            # Reusable config-driven report table
│   │   ├── LoadingSpinner.js         # Shared loading indicator
│   │   ├── ErrorAlert.js             # Shared error alert
│   │   └── ErrorBoundary.js          # React error boundary
│   ├── hooks/
│   │   ├── useApiData.js             # Generic data fetching hook
│   │   └── useEmployeeFilters.js     # Employee filter state management
│   ├── middleware/
│   │   └── api.js                    # HTTP client (fetch wrapper + ApiError class)
│   ├── services/
│   │   └── employeeService.js        # API service layer (endpoint abstraction)
│   ├── utils/
│   │   ├── buildUrl.js               # URL + query param builder
│   │   └── formatters.js             # Currency & date formatting
│   └── constants/
│       ├── currencies.js             # Currency list, values, stat card config
│       ├── countries.js              # Country filter options
│       ├── tableStyles.js            # Shared table header styles
│       └── departmentColors.js       # Department → MUI color mapping
├── tests/                            # Mirrors src/ structure
│   ├── components/                   # 13 component test files
│   ├── hooks/                        # 2 hook test files
│   ├── middleware/                   # API client tests
│   ├── services/                     # Service layer tests
│   └── utils/                        # Utility tests
├── .eslintrc.json                    # ESLint config (react-app + jest rules)
└── package.json
```

---

## 7. Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Frontend | React | 19.x | UI component library |
| UI Framework | Material UI (MUI) | 9.x | Design system, components, theming |
| Charts | Recharts | 3.x | Data visualization (bar charts) |
| Backend | Express | 5.x | REST API framework |
| Database | SQLite via better-sqlite3 | 12.x | Embedded relational database |
| Logging | Pino + pino-http | 10.x / 11.x | Structured JSON logging |
| Testing (Backend) | Jest + Supertest | 30.x / 7.x | Unit + integration tests |
| Testing (Frontend) | React Testing Library + Jest | 16.x | Component + hook tests |
| Linting | ESLint (react-app preset) | via CRA | Code quality enforcement |
| Deployment | Render (Web Service) | — | Cloud hosting (free tier) |
| Package Manager | npm | — | Dependency management |

---

## 8. API Reference

### Employee Endpoints

| Method | Endpoint | Query Parameters | Response |
|---|---|---|---|
| GET | `/api/employees` | `page`, `pageSize`, `search`, `department`, `currency`, `minSalary`, `maxSalary`, `fromDate`, `toDate` | `{ data: [...], page, pageSize, totalRecords, totalPages }` |

### Dashboard Endpoints

| Method | Endpoint | Query Parameters | Response |
|---|---|---|---|
| GET | `/api/dashboard` | `currency` | `{ averageSalary, highestSalary, lowestSalary, totalPayroll }` |
| GET | `/api/dashboard/departments` | — | `[{ department, count }]` |
| GET | `/api/dashboard/salary-distribution` | `currency` | `[{ salaryRange, employeeCount }]` |
| GET | `/api/dashboard/reports` | `country` | `{ top5HighestPaidEmployees, averageSalaryByDepartment, payrollByDepartment }` |

### System Endpoints

| Method | Endpoint | Response |
|---|---|---|
| GET | `/healthz` | `{ status: "ok", uptime: <seconds> }` |

### Error Response Format

All endpoints return errors in a consistent format:
```json
{ "error": "Human-readable error message" }
```
HTTP status codes: `200` (success), `500` (server error).

---

## 9. Database Schema

```sql
CREATE TABLE employees (
  employeeId TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  gender TEXT,
  department TEXT NOT NULL,
  designation TEXT NOT NULL,
  location TEXT NOT NULL,
  country TEXT NOT NULL,
  currency TEXT NOT NULL,
  joiningDate TEXT NOT NULL,
  salary REAL NOT NULL
);
```

**Journal mode:** WAL (Write-Ahead Logging) for concurrent read performance.
**Connection:** Singleton pattern — opened once on server start, reused for all requests.
