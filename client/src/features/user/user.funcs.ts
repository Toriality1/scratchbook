import type { User } from "./user.types";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

type ErrorMessage = { msg: string };

type ServerResponse<T> =
  | { ok: true; data: T }
  | { ok: false; data: ErrorMessage };

type AuthResponse = ServerResponse<{ user: User }>;
type RegisterResponse = ServerResponse<{ user: User }>;
type LoginResponse = ServerResponse<{ user: User }>;
type LogoutResponse = ServerResponse<undefined>;

export async function auth() {
  try {
    const res = await fetch(ENDPOINT + "users/auth", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to authenticate user");
    const text = await res.text();
    if (!text) throw new Error("No user data");
    return { ok: true, data: JSON.parse(text) };
  } catch (err) {
    console.log(err);
    return { ok: false, data: { msg: "Failed to authenticate user" } };
  }
}

export async function register(username: string, password: string) {
  const res = await fetch(ENDPOINT + "users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  return await res.json();
}

export async function login(username: string, password: string) {
  const res = await fetch(ENDPOINT + "users/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return await res.json();
}

export async function logout() {
  const res = await fetch(ENDPOINT + "users/logout", {
    method: "GET",
    credentials: "include",
  });

  return await res.json();
}
