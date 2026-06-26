import { headerRowSx, headerCellSx } from "./tableStyles";

describe("tableStyles", () => {
  it("should export headerRowSx with primary background", () => {
    expect(headerRowSx).toEqual({ backgroundColor: "primary.main" });
  });

  it("should export headerCellSx with white bold text", () => {
    expect(headerCellSx).toEqual({ color: "white", fontWeight: "bold" });
  });
});
