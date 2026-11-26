import { describe, it, expect, beforeEach } from "vitest";
import { useFilterStore } from "../filter-store";

describe("useFilterStore", () => {
  beforeEach(() => {
    useFilterStore.getState().resetFilters();
  });

  it("updates locality and BHK filters", () => {
    const store = useFilterStore.getState();
    store.setLocality("Baner");
    store.setBhk("2_BHK");

    const state = useFilterStore.getState();
    expect(state.locality).toBe("Baner");
    expect(state.bhk).toBe("2_BHK");
  });

  it("resets all filters to initial state", () => {
    const store = useFilterStore.getState();
    store.setLocality("Wakad");
    store.setBhk("3_BHK");
    store.setFurnishingStatus("FULLY_FURNISHED");

    store.resetFilters();
    const state = useFilterStore.getState();
    expect(state.locality).toBe("");
    expect(state.bhk).toBe("");
    expect(state.furnishingStatus).toBe("");
  });
});
