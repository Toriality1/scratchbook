export type User = {
  id: string;
  username: string;
  password: string;
};

export type UserContextType = {
  isAuthenticated: boolean;
  userId: string | null;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};
