import { formatSalary, formatDate } from "./formatters";

describe("formatSalary", () => {
  it("should format salary in INR currency", () => {
    expect(formatSalary(1800000)).toBe("₹18,00,000");
  });

  it("should format zero salary", () => {
    expect(formatSalary(0)).toBe("₹0");
  });

  it("should format small salary", () => {
    expect(formatSalary(50000)).toBe("₹50,000");
  });

  it("should format large salary with Indian number grouping", () => {
    expect(formatSalary(3200000)).toBe("₹32,00,000");
  });

  it("should truncate decimal places", () => {
    expect(formatSalary(1500000.75)).toBe("₹15,00,001");
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
