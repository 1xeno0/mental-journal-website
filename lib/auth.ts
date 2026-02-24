import { getCurrentUser } from "./api";

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
    const user = await getCurrentUser();
    return { ok: true, user };
  } catch (error) {
    return { ok: false };
  }
}
