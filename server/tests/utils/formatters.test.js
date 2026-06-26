const { formatRangeLabel } = require("../../src/utils/formatters");

describe("formatRangeLabel", () => {
  it("should format values under 1000 as plain numbers", () => {
    expect(formatRangeLabel(0, 999, false)).toBe("0-999");
  });

  it("should format thousands with K suffix", () => {
    expect(formatRangeLabel(1000, 5000, false)).toBe("1K-5K");
  });

  it("should format millions with M suffix", () => {
    expect(formatRangeLabel(1000000, 2000000, false)).toBe("1.0M-2.0M");
  });

  it("should format mixed range (K to M)", () => {
    expect(formatRangeLabel(500000, 1000000, false)).toBe("500K-1.0M");
  });

  it("should append + for last range", () => {
    expect(formatRangeLabel(100000, 200000, true)).toBe("100K+");
  });

  it("should handle last range with millions", () => {
    expect(formatRangeLabel(1000000, 2000000, true)).toBe("1.0M+");
  });

  it("should handle last range with plain numbers", () => {
    expect(formatRangeLabel(500, 1000, true)).toBe("500+");
  });
});
