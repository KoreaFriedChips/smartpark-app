
import { LocationObject } from "expo-location";
import { SortOption, SortOptions } from "@/components/utils/utils";
import { createContext, useContext, useMemo, useCallback } from "react";

export interface SearchContextProps {
  selectedCategories: string[],
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>,
  sortOption: SortOption,
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>,
  searchQuery: string | undefined,
  setSearchQuery: React.Dispatch<React.SetStateAction<string | undefined>>,
  prevSearches: string[],
  setPrevSearches: React.Dispatch<React.SetStateAction<string[]>>
}

export const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  const selectedCategories = useMemo(() => context ? context.selectedCategories : [], [context]);
  const setSelectedCategories = useCallback((cat: string[]) => {if (context) context.setSelectedCategories(cat)}, [context]);
  const sortOption = useMemo(() => context ? context.sortOption : SortOptions.distanceLowHigh, [context]);
  const setSortOption = useCallback((option: SortOption) => {if (context) context.setSortOption(option)}, [context]);
  const searchQuery = useMemo(() => context ? context.searchQuery : undefined, [context]);
  const setSearchQuery = useCallback((query: string) => {if (context) context.setSearchQuery(query)}, [context]);
  const prevSearches = useMemo(() => context ? context.prevSearches : [], [context]);
  const setPrevSearches = useCallback((s: string[]) => {if (context) context.setPrevSearches(s)}, [context]);
  return {
    selectedCategories, setSelectedCategories,
    sortOption, setSortOption,
    searchQuery, setSearchQuery,
    prevSearches, setPrevSearches
  }
}