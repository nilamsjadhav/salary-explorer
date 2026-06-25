export const CURRENCIES = [
  { value: "INR", label: "INR (₹)" },
  { value: "USD", label: "USD ($)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "JPY", label: "JPY (¥)" },
  { value: "AUD", label: "AUD (A$)" },
];

export const CURRENCY_VALUES = ["All", ...CURRENCIES.map((c) => c.value)];

export const STAT_CARDS = [
  { key: "averageSalary", label: "Average Salary", color: "#1976d2" },
  { key: "highestSalary", label: "Highest Salary", color: "#2e7d32" },
  { key: "lowestSalary", label: "Lowest Salary", color: "#ed6c02" },
  { key: "totalPayroll", label: "Total Payroll", color: "#9c27b0" },
];
