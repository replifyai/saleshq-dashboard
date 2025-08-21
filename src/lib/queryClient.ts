import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { apiRequest } from "./apiUtils";

type UnauthorizedBehavior = "throw" | "returnNull";

export { apiRequest };

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const res = await apiRequest('GET', queryKey[0] as string);
      return await res.json();
    } catch (error) {
      // Handle authentication redirect scenario
      if (error instanceof Error && error.message.includes('Authentication failed - redirecting to login')) {
        if (unauthorizedBehavior === "returnNull") {
          return null;
        }
        throw new Error('Session expired. Please log in again.');
      }
      
      // Handle other 401 errors (shouldn't happen with new auth logic, but kept for safety)
      if (unauthorizedBehavior === "returnNull" && error instanceof Error && error.message.includes('200')) {
        return null;
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
