// API Configuration utility
import { authService } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const getApiUrl = (endpoint: string): string => {
  // In development with Vite proxy, use relative paths
  if (process.env.DEV) {
    return endpoint;
  }
  
  // In production, use the full API URL
  return `${API_BASE_URL}${endpoint}`;
};

export const apiConfig = {
  baseUrl: API_BASE_URL,
  timeout: 90000,
  withCredentials: true,
};

// Build a WebSocket URL for the given endpoint (e.g. "/ws/realtime-transcription")
export const getWsUrl = (endpoint: string): string => {
  console.log("🚀 ~ getWsUrl ~ endpoint:", endpoint);
  if (endpoint.startsWith('ws://') || endpoint.startsWith('wss://')) {
    return endpoint;
  }

  // In development, connect via Vite dev server host so the proxy can forward WS
  if (process.env.NEXT_PUBLIC_ENV === 'development') {
    const wsProto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    console.log("🚀 ~ getWsUrl ~ wsProto:", wsProto);
    console.log("🚀 ~ getWsUrl ~ ${wsProto}://${window.location.host}${endpoint}:", `${wsProto}//${window.location.host}${endpoint}`);
    return `${wsProto}://${process.env.NEXT_PUBLIC_SOCKET_URL}${endpoint}`;
  }

  // In production, derive WS base from API base URL
  const wsBase = API_BASE_URL.replace(/^http/i, 'ws');
  return `${wsBase}${endpoint}`;
};

// Enhanced API client with automatic authentication
export class ApiClient {
  constructor() {
    // All URL handling is done through getApiUrl function
  }

  private getFullUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint; // Already a full URL
    }
    return getApiUrl(endpoint);
  }

  // GET request with automatic authentication
  async get<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = this.getFullUrl(endpoint);
    const response = await authService.authenticatedFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`GET ${endpoint} failed: ${response.statusText}`);
    }

    return response.json();
  }

  // POST request with automatic authentication
  async post<T = any>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    const url = this.getFullUrl(endpoint);
    const response = await authService.authenticatedFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed: ${response.statusText}`);
    }

    return response.json();
  }

  // PUT request with automatic authentication
  async put<T = any>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    const url = this.getFullUrl(endpoint);
    const response = await authService.authenticatedFetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`PUT ${endpoint} failed: ${response.statusText}`);
    }

    return response.json();
  }

  // DELETE request with automatic authentication
  async delete<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = this.getFullUrl(endpoint);
    const response = await authService.authenticatedFetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`DELETE ${endpoint} failed: ${response.statusText}`);
    }

    return response.json();
  }

  // PATCH request with automatic authentication
  async patch<T = any>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    const url = this.getFullUrl(endpoint);
    const response = await authService.authenticatedFetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`PATCH ${endpoint} failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Raw request method for custom scenarios (e.g., FormData)
  async request<T = any>(endpoint: string, options: RequestInit): Promise<T> {
    const url = this.getFullUrl(endpoint);
    const response = await authService.authenticatedFetch(url, options);

    if (!response.ok) {
      throw new Error(`${options.method || 'REQUEST'} ${endpoint} failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Upload file with automatic authentication
  async uploadFile<T = any>(endpoint: string, file: File, additionalData: Record<string, string> = {}): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add any additional form data
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const url = this.getFullUrl(endpoint);
    const response = await authService.authenticatedFetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let browser set it with boundary for FormData
    });

    if (!response.ok) {
      throw new Error(`File upload to ${endpoint} failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Export a default instance
export const apiClient = new ApiClient();

// Convenience functions using the default instance
export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) => apiClient.get<T>(endpoint, options),
  post: <T = any>(endpoint: string, data?: any, options?: RequestInit) => apiClient.post<T>(endpoint, data, options),
  put: <T = any>(endpoint: string, data?: any, options?: RequestInit) => apiClient.put<T>(endpoint, data, options),
  delete: <T = any>(endpoint: string, options?: RequestInit) => apiClient.delete<T>(endpoint, options),
  patch: <T = any>(endpoint: string, data?: any, options?: RequestInit) => apiClient.patch<T>(endpoint, data, options),
  uploadFile: <T = any>(endpoint: string, file: File, additionalData?: Record<string, string>) => 
    apiClient.uploadFile<T>(endpoint, file, additionalData),
}; 