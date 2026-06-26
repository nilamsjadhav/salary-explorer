# Salary Explorer — Design Decisions & Trade-offs

---

## 1. Planning & Design Notes

### Development Approach

- **Micro-commit strategy**: Each feature built incrementally — implement, test, get human approval, commit. Every commit is small, reviewable, and independently reversible.
- **Test-alongside development**: Backend tests written alongside every endpoint and service function. Frontend tests for every component, hook, and utility.
- **AI-assisted development**: GitHub Copilot CLI used for code generation, refactoring guidance, and test authoring. Human review and explicit approval required at every commit point. AI runs tests before declaring any change complete.

### Design Decisions

| Decision | Rationale |
|---|---|
| **Tab-based layout** | Separates Workforce Overview and Dashboard to avoid overwhelming the user with too much information. Clean context switching. |
| **Country filter on Reports** | Allows drill-down analysis without complex multi-dimensional filtering. Keeps the UI simple while enabling meaningful country-specific insights. |
| **Server-side pagination** | Client doesn't load all 10,000 records at once. LIMIT/OFFSET with total count enables responsive pagination at any dataset size. |
| **Server-side search with debounce** | Search executes SQL LIKE queries server-side for accuracy across full dataset. 300ms debounce prevents excessive API calls while typing. First load fires immediately (no debounce delay). |
| **Single-port deployment** | Express serves both API endpoints and the React production build. Compatible with Render free tier (single web service). Eliminates CORS in production. |
| **Currency-scoped KPIs** | Dashboard KPI cards filter by currency to avoid meaningless cross-currency aggregations (e.g., averaging INR and USD salaries). |
| **Single reports endpoint** | All three reports are displayed on the same page with the same country filter. A single `/api/dashboard/reports` call returns all three, reducing network round-trips and simplifying frontend loading/error states. |
| **Composition over inheritance** | React components composed from small, reusable pieces (hooks, shared components) rather than class hierarchies. Follows modern React patterns. |

---

## 2. Trade-off Explanations

### SQLite vs PostgreSQL

| Factor | SQLite (Chosen ✅) | PostgreSQL |
|---|---|---|
| Setup complexity | Zero — file-based, no server needed | Requires managed instance or Docker |
| Deployment | Single file, part of the app | Separate database service |
| Cost | Free, no external service | Free tier limited (e.g., Render 90-day expiry) |
| Concurrency | Single-writer (WAL helps with reads) | Full MVCC, unlimited concurrency |
| Scaling | Comfortable up to ~1M records | Unlimited |
| Tooling | better-sqlite3 (sync, fast) | pg/knex (async, more setup) |

**Decision**: SQLite is the right choice for a read-heavy analytics demo. Zero operational overhead, zero cost, and better-sqlite3's synchronous API simplifies the code. WAL mode handles concurrent reads during dashboard loads. PostgreSQL would be overkill — adding a separate service, connection pooling, and async complexity for no benefit at this scale.

---

### better-sqlite3 vs sqlite3 (async)

| Factor | better-sqlite3 (Chosen ✅) | sqlite3 (async) |
|---|---|---|
| API style | Synchronous — direct return values | Callback/Promise-based |
| Performance | 2-5x faster (no async overhead, no serialization) | Slower due to async bridging |
| Code simplicity | `const row = db.prepare(...).get()` | `db.get(..., (err, row) => {...})` |
| Prepared statements | First-class, reusable | Limited support |
| Transaction API | `db.transaction(() => {...})` | Manual BEGIN/COMMIT |

**Decision**: Synchronous API is superior for read-heavy analytics. Every database call completes in microseconds — making them async adds Promise overhead with zero benefit. The simpler code is easier to test, debug, and maintain.

---

### Express 5 vs Express 4

| Factor | Express 5 (Chosen ✅) | Express 4 |
|---|---|---|
| Async error handling | Automatically catches rejected Promises | Requires `express-async-errors` wrapper |
| Route syntax | `/{*splat}` for catch-all | `*` wildcard |
| Community resources | Newer, growing | Vast, battle-tested |
| Future support | Active development | Maintenance mode |

**Decision**: Express 5's automatic async error propagation eliminates an entire class of bugs (unhandled Promise rejections crashing the server). The `/{*splat}` syntax change is minor. Long-term support makes it the better investment.

---

### Single Reports Endpoint vs Multiple Endpoints

| Factor | Single Endpoint (Chosen ✅) | Separate Endpoints |
|---|---|---|
| Network requests | 1 call for all 3 reports | 3 parallel calls |
| Loading state | Single loading indicator | Complex per-report loading |
| Error handling | One try/catch | Three independent error states |
| Flexibility | All or nothing | Partial success possible |
| Backend coupling | Reports tied together | Independently deployable |

**Decision**: All three reports are always displayed together with the same country filter. A single endpoint reduces network overhead and dramatically simplifies frontend state management. Backend service functions remain modular — they can be split into separate endpoints later if needed.

---

### Server-side Search vs Client-side Search

| Factor | Server-side (Chosen ✅) | Client-side |
|---|---|---|
| Accuracy | Searches full 10,000 records | Only searches current page |
| Latency | Network round-trip (~5ms for SQLite) | Instant (data in memory) |
| Scalability | Unlimited dataset size | Browser memory limited |
| Implementation | SQL LIKE + debounce | Array.filter() |

**Decision**: With 10,000 records and 20-per-page pagination, client-side search would only search the current 20 rows — missing 99.8% of matches. Server-side search with 300ms debounce provides accurate results with imperceptible latency.

---

### Recharts vs Chart.js vs MUI Charts

| Factor | Recharts (Chosen ✅) | Chart.js | MUI Charts |
|---|---|---|---|
| React integration | Native React components | Canvas-based, needs wrapper | MUI-native |
| Bundle size | ~45KB (tree-shakeable) | ~60KB | Part of MUI X (premium) |
| Customization | JSX-based, composable | Config objects | Limited in free tier |
| Learning curve | Familiar JSX patterns | Separate API | MUI patterns |

**Decision**: Recharts' declarative JSX API (`<BarChart>`, `<XAxis>`, `<Tooltip>`) integrates naturally with the React component model. No canvas abstraction layer needed. Tree-shaking keeps the bundle lean by only including used chart types.

---

## 3. Performance Considerations

### Current Optimizations

| Area | Technique | Impact |
|---|---|---|
| **Database** | WAL journal mode | Allows concurrent reads while writing |
| **Database** | Prepared statements | Query plan cached, reused across calls |
| **Seeding** | Transaction-batched inserts | 10,000 records inserted in a single transaction (~100ms vs ~10s row-by-row) |
| **Seed check** | Count comparison before seeding | Avoids redundant inserts on every server restart |
| **Pagination** | Server-side LIMIT/OFFSET | Only 20 records transferred per request |
| **Search debounce** | 300ms client-side debounce | Prevents API call on every keystroke |
| **Static assets** | `express.static()` | Browser caching for React build files |
| **Bundle size** | Named MUI imports | Tree-shaking eliminates unused components |
| **DB singleton** | Module-level connection | DB opened once, reused for all requests |
| **Immediate first load** | `isInitialLoad` ref | First data fetch fires without debounce delay |

### Scaling Path (If Needed)

```
Current (10K records)
    │
    ├── Step 1: Add DB indexes on salary, country, department, joiningDate
    │   └── Expected: 10x faster filtered queries
    │
    ├── Step 2: Cache dashboard + reports responses (in-memory, TTL: 5 min)
    │   └── Expected: Dashboard loads in <1ms after first hit
    │
    ├── Step 3: Cursor-based pagination (WHERE employeeId > @lastId LIMIT 20)
    │   └── Expected: Constant-time pagination regardless of page depth
    │
    ├── Step 4: SQL-based salary distribution (GROUP BY salary ranges)
    │   └── Expected: Eliminates fetching all salary rows into Node.js
    │
    └── Step 5: Consider PostgreSQL + connection pooling
        └── Expected: Full MVCC concurrency, unlimited scaling
```
