import api from "./axios";
import { endpoints } from "./endpoints";
import type { AuthResponse, User } from "@/types/user";

const USE_MOCK = !import.meta.env.VITE_API_BASE_URL;

export async function login(email: string, password: string): Promise<AuthResponse> {
  if (USE_MOCK) {
    if (!email || !password) throw new Error("Email and password required");
    return {
      token: "mock.jwt.token." + btoa(email),
      user: { id: "u_1", email, name: email.split("@")[0] },
    };
  }
  const { data } = await api.post<AuthResponse>(endpoints.auth.login, {
    email,
    password,
  });
  return data;
}

export async function register(
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> {
  if (USE_MOCK) {
    return {
      token: "mock.jwt.token." + btoa(email),
      user: { id: "u_new", email, name: name ?? email.split("@")[0] },
    };
  }
  const { data } = await api.post<AuthResponse>(endpoints.auth.register, {
    email,
    password,
    name,
  });
  return data;
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get<User>(endpoints.auth.profile);
  return data;
}
