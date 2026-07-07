import { describe, it, expect, beforeEach } from "vitest";
import { useInstructorsFilterStore } from "../lib/store-instructors";

describe("useInstructorsFilterStore", () => {
  beforeEach(() => {
    useInstructorsFilterStore.getState().resetFilters();
  });

  it("should initialize with default values", () => {
    const state = useInstructorsFilterStore.getState();
    expect(state.searchQuery).toBe("");
    expect(state.selectedCategory).toBe("TODAS");
    expect(state.maxPrice).toBe(150);
    expect(state.maxRadius).toBe(25);
    expect(state.currentPage).toBe(1);
  });

  it("should update searchQuery and reset page to 1", () => {
    useInstructorsFilterStore.getState().setCurrentPage(3);
    useInstructorsFilterStore.getState().setSearchQuery("Amanda");
    
    const state = useInstructorsFilterStore.getState();
    expect(state.searchQuery).toBe("Amanda");
    expect(state.currentPage).toBe(1);
  });

  it("should update selectedCategory and reset page to 1", () => {
    useInstructorsFilterStore.getState().setCurrentPage(2);
    useInstructorsFilterStore.getState().setSelectedCategory("A");

    const state = useInstructorsFilterStore.getState();
    expect(state.selectedCategory).toBe("A");
    expect(state.currentPage).toBe(1);
  });

  it("should reset all filters back to default values", () => {
    useInstructorsFilterStore.getState().setSearchQuery("Amanda");
    useInstructorsFilterStore.getState().setSelectedCategory("B");
    useInstructorsFilterStore.getState().setMaxPrice(100);
    useInstructorsFilterStore.getState().setMaxRadius(10);
    useInstructorsFilterStore.getState().setCurrentPage(5);

    useInstructorsFilterStore.getState().resetFilters();

    const state = useInstructorsFilterStore.getState();
    expect(state.searchQuery).toBe("");
    expect(state.selectedCategory).toBe("TODAS");
    expect(state.maxPrice).toBe(150);
    expect(state.maxRadius).toBe(25);
    expect(state.currentPage).toBe(1);
  });
});
