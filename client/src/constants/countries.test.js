import { COUNTRIES } from "./countries";

describe("countries", () => {
  it("should include All as first entry", () => {
    expect(COUNTRIES[0]).toBe("All");
  });

  it("should contain 16 entries", () => {
    expect(COUNTRIES).toHaveLength(16);
  });

  it("should be sorted alphabetically after All", () => {
    const withoutAll = COUNTRIES.slice(1);
    const sorted = [...withoutAll].sort();
    expect(withoutAll).toEqual(sorted);
  });
});
