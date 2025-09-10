import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import * as funcs from "./user.funcs";
import { UserContext } from "./UserContext";

export function UserProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    funcs.auth().then(({ok, data}) => {
      if (ok) {
        setIsAuthenticated(true);
        setUserId(data.id);
      }
    });
  }, []);

  const register = async (username: string, password: string) => {
    funcs.register(username, password).then((data) => {
      setIsAuthenticated(true);
      setUserId(data);
    });
  };

  const login = async (username: string, password: string) => {
    funcs.login(username, password).then((data) => {
      setIsAuthenticated(true);
      setUserId(data.user);
    });
  };

  const logout = async () => {
    funcs.logout().then(() => {
      setIsAuthenticated(false);
      setUserId(null);
    });
  };

  return (
    <UserContext.Provider
      value={{ isAuthenticated, userId, register, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}
