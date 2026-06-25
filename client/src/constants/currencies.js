export const CURRENCIES = [
  { value: "INR", label: "INR (₹)" },
  { value: "USD", label: "USD ($)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "JPY", label: "JPY (¥)" },
  { value: "AUD", label: "AUD (A$)" },
  { value: "CAD", label: "CAD (C$)" },
  { value: "AED", label: "AED (د.إ)" },
  { value: "SGD", label: "SGD (S$)" },
  { value: "KRW", label: "KRW (₩)" },
  { value: "MXN", label: "MXN ($)" },
  { value: "BRL", label: "BRL (R$)" },
  { value: "CNY", label: "CNY (¥)" },
];

export const CURRENCY_VALUES = ["All", ...CURRENCIES.map((c) => c.value)];

export const STAT_CARDS = [
  { key: "averageSalary", label: "Average Salary", color: "#1976d2" },
  { key: "highestSalary", label: "Highest Salary", color: "#2e7d32" },
  { key: "lowestSalary", label: "Lowest Salary", color: "#ed6c02" },
  { key: "totalPayroll", label: "Total Payroll", color: "#9c27b0" },
];
