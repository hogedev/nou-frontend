import { useAuthStore } from "../stores/auth-store";

const API_URL = import.meta.env.VITE_API_URL || "/api/v1";

function authHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options?.headers,
    },
  });
  if (response.status === 401) {
    useAuthStore.getState().logout();
  }
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

export async function uploadFormData<T>(
  endpoint: string,
  formData: FormData,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    body: formData,
    headers: authHeaders(),
  });
  if (response.status === 401) {
    useAuthStore.getState().logout();
  }
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

export async function deleteApi(endpoint: string): Promise<void> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (response.status === 401) {
    useAuthStore.getState().logout();
  }
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
}

export function photoUrl(photoId: number, thumb?: boolean): string {
  const token = useAuthStore.getState().token;
  const w = thumb ? "&w=800" : "";
  return `${API_URL}/photos/${photoId}/image?token=${token || ""}${w}`;
}
