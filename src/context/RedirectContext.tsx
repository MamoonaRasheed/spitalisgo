// contexts/RedirectContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

type RedirectContextType = {
  redirectPath: string;
  setRedirectPath: (path: string) => void;
};

const RedirectContext = createContext<RedirectContextType | undefined>(undefined);

export function RedirectProvider({ children }: { children: React.ReactNode }) {
  const [redirectPath, setRedirectPath] = useState<string>("/");

  return (
    <RedirectContext.Provider value={{ redirectPath, setRedirectPath }}>
      {children}
    </RedirectContext.Provider>
  );
}

export function useRedirect() {
  const context = useContext(RedirectContext);
  if (!context) {
    throw new Error("useRedirect must be used within a RedirectProvider");
  }
  return context;
}
