import { formatSalary, formatDate } from "./formatters";

describe("formatSalary", () => {
  it("should format INR salary", () => {
    expect(formatSalary(1800000, "INR")).toBe("₹18,00,000");
  });

  it("should format USD salary", () => {
    expect(formatSalary(185000, "USD")).toBe("$185,000");
  });

  it("should format GBP salary", () => {
    expect(formatSalary(72000, "GBP")).toBe("£72,000");
  });

  it("should format EUR salary", () => {
    expect(formatSalary(75000, "EUR")).toContain("75.000");
  });

  it("should format JPY salary", () => {
    expect(formatSalary(9500000, "JPY")).toContain("9,500,000");
  });

  it("should format AUD salary", () => {
    expect(formatSalary(95000, "AUD")).toContain("95,000");
  });

  it("should default to INR when no currency provided", () => {
    expect(formatSalary(1800000)).toBe("₹18,00,000");
  });

  it("should format zero salary", () => {
    expect(formatSalary(0, "USD")).toBe("$0");
  });
});

describe("formatDate", () => {
  it("should format date in en-IN locale", () => {
    expect(formatDate("2021-03-15")).toBe("15 Mar 2021");
  });

  it("should format another date correctly", () => {
    expect(formatDate("2019-07-10")).toBe("10 Jul 2019");
  });

  it("should handle January date", () => {
    expect(formatDate("2022-01-20")).toBe("20 Jan 2022");
  });

  it("should handle December date", () => {
    expect(formatDate("2023-12-25")).toBe("25 Dec 2023");
  });

  it("should handle first day of year", () => {
    expect(formatDate("2024-01-01")).toBe("1 Jan 2024");
  });
});
