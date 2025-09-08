import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type User = {
  id: string;
  username: string;
  password: string;
};

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(ENDPOINT + "users/auth", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setUser(data);
          setIsAuthenticated(true);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const register = async (username: string, password: string) => {
    const res = await fetch(ENDPOINT + "users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      throw new Error("Registration failed");
    }

    const data = await res.json();
    setIsAuthenticated(true);
    setUser(data);
  };

  const login = async (username: string, password: string) => {
    const res = await fetch(ENDPOINT + "users/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // important for cookies!
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const data = await res.json();
    setIsAuthenticated(true);
    setUser(data.user);
  };

  const logout = async () => {
    await fetch(ENDPOINT + "users/logout", {
      method: "GET",
      credentials: "include",
    });
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
