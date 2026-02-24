// Use relative path in production to leverage Vercel rewrites and avoid Mixed Content issues
const API_BASE = process.env.NODE_ENV === 'production' 
  ? "/api" 
  : (process.env.NEXT_PUBLIC_API_BASE || "/api");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface FetchOptions extends RequestInit {
  // Add any custom options here if needed
}

export interface Entry {
  id: string;
  mood: string;
  tags: string[];
  note: string;
  ai_response?: string;
  disclaimer?: string;
  created_at: string;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If parsing fails, use status text
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  // Handle empty responses (e.g. 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  try {
    return await response.json();
  } catch {
    // If parsing fails but status is ok (e.g. 201 with no body), return empty object
    return {} as T;
  }
}

// Auth Routes
export async function loginUser(credentials: { email: string; password: string }): Promise<void> {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function registerUser(credentials: { email: string; password: string }): Promise<void> {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function getCurrentUser(): Promise<any> {
  return apiFetch("/auth/me", { cache: "no-store" });
}

export async function logoutUser(): Promise<void> {
  return apiFetch("/auth/logout", { 
    method: "POST", 
    body: JSON.stringify({}), // Send empty JSON body to ensure server treats it as JSON
    cache: "no-store" 
  });
}

// Entry Routes
export async function getEntries(): Promise<Entry[]> {
  return apiFetch<Entry[]>("/entries");
}

export async function createEntry(data: { mood: string; tags: string[]; note: string }): Promise<Entry> {
  return apiFetch<Entry>("/entries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateEntry(id: string, data: { mood: string; tags: string[]; note: string }): Promise<Entry> {
  return apiFetch<Entry>(`/entries/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteEntry(id: string): Promise<void> {
  return apiFetch(`/entries/${id}`, { method: "DELETE" });
}

// AI Routes
export async function vibeCheck(note: string): Promise<{ ai_response: string }> {
  return apiFetch<{ ai_response: string }>("/ai/vibe-check", {
    method: "POST",
    body: JSON.stringify({ note }),
  });
}

// Analytics Routes
export async function getWeeklyAnalytics(): Promise<any> {
  return apiFetch("/analytics/weekly");
}
