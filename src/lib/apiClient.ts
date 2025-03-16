import { refreshAuthToken } from "@/services/authAppService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include", // ⬅️ Ensure cookies are sent with the request
      headers: {
        "Content-Type": "application/json",
        ...options.headers, // ⬅️ Preserve custom headers if provided
      },
      body: options.body ? JSON.stringify(options.body) : undefined, // ⬅️ Attach the body if provided
    });

    // 🔹 If token expired (401 Unauthorized), try refreshing it
    if (response.status === 401) {
      const refreshSuccess = await refreshAuthToken();
      if (refreshSuccess.success) {
        // Retry the original request after refreshing token
        return fetchWithAuth(endpoint, options);

      } else {
        // If refresh fails, redirect to login
        window.location.href = "/login";
        return Promise.reject("Session expired. Redirecting to login.");
      }
    }

    const result = await response.json();
    if (result.success === false) {
        throw new Error(result.message);
    }
    return result;

  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
