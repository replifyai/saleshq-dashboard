/**
 * User Management API Layer
 * Handles user-related operations like fetching all users and creating new users
 * Base URL: https://dashboardapi-4nnrh34aza-el.a.run.app/
 */

import { authService } from './auth';

// Types for User Management API
export interface User {
  email: string;
  name: string;
  role: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  usage?: string;
}

export interface GetAllUsersResponse {
  data: User[];
  totalCount: number;
  page: string;
  totalPages: number;
  pageSize: string;
  hasMore: boolean;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: string;
  name: string;
}

export interface CreateUserResponse {
  user?: User;
  message?: string;
  data?: User;
  success?: boolean;
}

// Custom error class for User Management API operations
export class UserManagementApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'UserManagementApiError';
  }
}

// Base URL for the user management API
const USER_MANAGEMENT_API_BASE = 'https://dashboardapi-4nnrh34aza-el.a.run.app';

// Helper function for API requests
async function userApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${USER_MANAGEMENT_API_BASE}${endpoint}`;
  
  try {
    const response = await authService.authenticatedFetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Request failed: ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData?.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new UserManagementApiError(
        errorMessage,
        'API_ERROR',
        response.status
      );
    }

    // Handle empty responses
    const responseText = await response.text();
    if (!responseText) return {} as T;
    
    return JSON.parse(responseText);
  } catch (error) {
    if (error instanceof UserManagementApiError) {
      throw error;
    }
    
    if (error instanceof Error && error.message.includes('Authentication failed')) {
      throw new UserManagementApiError('Session expired. Please log in again.', 'AUTH_ERROR');
    }
    
    throw new UserManagementApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'NETWORK_ERROR'
    );
  }
}

/**
 * User Management API Operations
 */
export const userManagementApi = {
  /**
   * Get all users with pagination and optional search
   * POST /getallusers?pageSize=X&pageNumber=Y&search=term
   */
  getAllUsers: async (
    pageSize: number = 10, 
    pageNumber: number = 1, 
    searchTerm?: string
  ): Promise<GetAllUsersResponse> => {
    let endpoint = `/getallusers?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    if (searchTerm && searchTerm.trim()) {
      endpoint += `&search=${encodeURIComponent(searchTerm.trim())}`;
    }
    return userApiRequest<GetAllUsersResponse>(endpoint, {
      method: 'POST',
      body: '',
    });
  },

  /**
   * Create a new user
   * POST /createUser
   */
  createUser: async (userData: CreateUserRequest): Promise<CreateUserResponse> => {
    return userApiRequest<CreateUserResponse>('/createUser', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

export default userManagementApi;