import { renderHook, act, waitFor } from "@testing-library/react";
import useApiData from "../../src/hooks/useApiData";

describe("useApiData", () => {
  it("should start with loading true and data null", () => {
    const fetchFn = jest.fn(() => new Promise(() => {}));
    const { result } = renderHook(() => useApiData(fetchFn, []));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should set data on successful fetch", async () => {
    const mockData = [{ id: 1, name: "Alice" }];
    const fetchFn = jest.fn(() => Promise.resolve(mockData));

    const { result } = renderHook(() => useApiData(fetchFn, []));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("should set error on failed fetch", async () => {
    const fetchFn = jest.fn(() => Promise.reject(new Error("Network error")));

    const { result } = renderHook(() => useApiData(fetchFn, []));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Network error");
  });

  it("should refetch when deps change", async () => {
    const fetchFn = jest.fn()
      .mockResolvedValueOnce({ value: "first" })
      .mockResolvedValueOnce({ value: "second" });

    let dep = "a";
    const { result, rerender } = renderHook(() => useApiData(fetchFn, [dep]));

    await waitFor(() => {
      expect(result.current.data).toEqual({ value: "first" });
    });

    dep = "b";
    rerender();

    await waitFor(() => {
      expect(result.current.data).toEqual({ value: "second" });
    });

    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it("should expose a refetch function", async () => {
    const fetchFn = jest.fn()
      .mockResolvedValueOnce("initial")
      .mockResolvedValueOnce("refreshed");

    const { result } = renderHook(() => useApiData(fetchFn, []));

    await waitFor(() => {
      expect(result.current.data).toBe("initial");
    });

    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.data).toBe("refreshed");
    });
  });
});
