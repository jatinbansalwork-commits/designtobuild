"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface PortfolioFilterContextValue {
  filter: string;
  setFilter: (value: string) => void;
}

const PortfolioFilterContext = createContext<PortfolioFilterContextValue | null>(
  null,
);

export function PortfolioFilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilterState] = useState("All");

  const setFilter = useCallback((value: string) => {
    setFilterState(value);
  }, []);

  const value = useMemo(() => ({ filter, setFilter }), [filter, setFilter]);

  return (
    <PortfolioFilterContext.Provider value={value}>
      {children}
    </PortfolioFilterContext.Provider>
  );
}

export function usePortfolioFilter() {
  return useContext(PortfolioFilterContext);
}
