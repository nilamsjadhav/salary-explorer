import { renderHook, act } from "@testing-library/react";
import useEmployeeFilters from "./useEmployeeFilters";

describe("useEmployeeFilters", () => {
  it("should have correct initial state", () => {
    const { result } = renderHook(() => useEmployeeFilters());

    expect(result.current.searchTerm).toBe("");
    expect(result.current.fromDate).toBe("");
    expect(result.current.toDate).toBe("");
    expect(result.current.minSalary).toBe("");
    expect(result.current.maxSalary).toBe("");
    expect(result.current.currency).toBe("All");
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it("should reset page to 1 when search changes", () => {
    const { result } = renderHook(() => useEmployeeFilters());

    act(() => result.current.setPage(3));
    expect(result.current.page).toBe(3);

    act(() => result.current.handleSearchChange("test"));
    expect(result.current.searchTerm).toBe("test");
    expect(result.current.page).toBe(1);
  });

  it("should reset page to 1 when date changes", () => {
    const { result } = renderHook(() => useEmployeeFilters());

    act(() => result.current.setPage(2));

    act(() => result.current.handleFromDateChange("2023-01-01"));
    expect(result.current.fromDate).toBe("2023-01-01");
    expect(result.current.page).toBe(1);

    act(() => result.current.setPage(2));

    act(() => result.current.handleToDateChange("2023-12-31"));
    expect(result.current.toDate).toBe("2023-12-31");
    expect(result.current.page).toBe(1);
  });

  it("should reset salary fields when currency set to All", () => {
    const { result } = renderHook(() => useEmployeeFilters());

    act(() => result.current.handleCurrencyChange("USD"));
    act(() => result.current.handleMinSalaryChange("1000"));
    act(() => result.current.handleMaxSalaryChange("5000"));

    expect(result.current.currency).toBe("USD");
    expect(result.current.minSalary).toBe("1000");
    expect(result.current.maxSalary).toBe("5000");

    act(() => result.current.handleCurrencyChange("All"));
    expect(result.current.currency).toBe("All");
    expect(result.current.minSalary).toBe("");
    expect(result.current.maxSalary).toBe("");
  });

  it("should reset page on salary filter changes", () => {
    const { result } = renderHook(() => useEmployeeFilters());

    act(() => result.current.setPage(5));
    act(() => result.current.handleMinSalaryChange("2000"));
    expect(result.current.page).toBe(1);

    act(() => result.current.setPage(5));
    act(() => result.current.handleMaxSalaryChange("8000"));
    expect(result.current.page).toBe(1);
  });
});
