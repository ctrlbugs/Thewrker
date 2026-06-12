"use client";

import { createContext, useContext } from "react";
import { useCareerOS } from "@/hooks/useCareerOS";

type CareerOSContextValue = ReturnType<typeof useCareerOS>;

const CareerOSContext = createContext<CareerOSContextValue | null>(null);

export function CareerOSProvider({ children }: { children: React.ReactNode }) {
  const value = useCareerOS();
  return <CareerOSContext.Provider value={value}>{children}</CareerOSContext.Provider>;
}

export function useCareerOSContext() {
  const context = useContext(CareerOSContext);
  if (!context) {
    throw new Error("useCareerOSContext must be used within CareerOSProvider");
  }
  return context;
}
