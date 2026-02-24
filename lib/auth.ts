import { apiFetch } from "./api";

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  ok: boolean;
  user?: User;
}

export async function checkAuth(): Promise<AuthResponse> {
  try {
    const user = await apiFetch<User>("/auth/me");
    return { ok: true, user };
  } catch (error) {
    return { ok: false };
  }
}
