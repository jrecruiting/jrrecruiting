"use client";

import { createContext, useContext, useTransition, type ReactNode } from "react";

type SearchTransitionValue = {
  isPending: boolean;
  startTransition: (callback: () => void) => void;
};

const SearchTransitionContext = createContext<SearchTransitionValue | null>(null);

// Shared between FilterSidebar (which triggers the URL update) and the
// results grid (which needs to know when a fetch is in flight) -- they're
// siblings under the search page, so this is the simplest way to let one
// tell the other "we're loading" without threading state through the
// server-rendered page itself.
export function SearchTransitionProvider({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = useTransition();
  return (
    <SearchTransitionContext.Provider value={{ isPending, startTransition }}>
      {children}
    </SearchTransitionContext.Provider>
  );
}

export function useSearchTransition() {
  const ctx = useContext(SearchTransitionContext);
  if (!ctx) throw new Error("useSearchTransition must be used within SearchTransitionProvider");
  return ctx;
}
