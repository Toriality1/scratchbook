import { createContext, useContext } from "react";
import type { UserContextType } from "./user.types";

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
