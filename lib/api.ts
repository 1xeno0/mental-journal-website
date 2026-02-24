const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

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

export async function vibeCheck(note: string): Promise<{ ai_response: string }> {
  return apiFetch<{ ai_response: string }>("/ai/vibe-check", {
    method: "POST",
    body: JSON.stringify({ note }),
  });
}
