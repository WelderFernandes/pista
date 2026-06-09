import { create } from "zustand";

interface InstructorsFilterState {
  searchQuery: string;
  selectedCategory: string;
  maxPrice: number;
  maxRadius: number;
  currentPage: number;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setMaxPrice: (price: number) => void;
  setMaxRadius: (radius: number) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
}

export const useInstructorsFilterStore = create<InstructorsFilterState>((set) => ({
  searchQuery: "",
  selectedCategory: "TODAS",
  maxPrice: 150,
  maxRadius: 25,
  currentPage: 1,
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setSelectedCategory: (category) => set({ selectedCategory: category, currentPage: 1 }),
  setMaxPrice: (price) => set({ maxPrice: price, currentPage: 1 }),
  setMaxRadius: (radius) => set({ maxRadius: radius, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  resetFilters: () => set({
    searchQuery: "",
    selectedCategory: "TODAS",
    maxPrice: 150,
    maxRadius: 25,
    currentPage: 1,
  }),
}));
