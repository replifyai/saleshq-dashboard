const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  idToken: string;
  refreshToken: string;
}

export interface AuthTokens {
  idToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_tokens';
  private refreshTokenPromise: Promise<string> | null = null;

  // Cookie helper functions
  private setCookie(name: string, value: string, options: {
    expires?: Date;
    maxAge?: number;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    path?: string;
  } = {}): void {
    if (typeof document === 'undefined') return; // SSR check
    
    const {
      expires,
      maxAge,
      secure = true,
      sameSite = 'lax',
      path = '/'
    } = options;

    let cookieString = `${name}=${encodeURIComponent(value)}`;
    
    if (expires) cookieString += `; expires=${expires.toUTCString()}`;
    if (maxAge) cookieString += `; max-age=${maxAge}`;
    if (secure) cookieString += `; secure`;
    if (sameSite) cookieString += `; samesite=${sameSite}`;
    if (path) cookieString += `; path=${path}`;

    document.cookie = cookieString;
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null; // SSR check
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    
    return null;
  }

  private deleteCookie(name: string): void {
    if (typeof document === 'undefined') return; // SSR check
    
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=lax`;
  }

  // Get tokens from cookies
  getTokens(): AuthTokens | null {
    try {
      const stored = this.getCookie(this.TOKEN_KEY);
      if (!stored) return null;
      
      const tokens = JSON.parse(stored) as AuthTokens;
      return tokens;
    } catch {
      return null;
    }
  }

  // Save tokens to cookies
  setTokens(tokens: LoginResponse): void {
    const authTokens: AuthTokens = {
      ...tokens,
      expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour from now
    };
    
    // Set cookie to expire in 7 days
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    
    this.setCookie(this.TOKEN_KEY, JSON.stringify(authTokens), {
      expires,
      secure: true,
      sameSite: 'lax',
      path: '/'
    });
  }

  // Remove tokens from cookies
  clearTokens(): void {
    this.deleteCookie(this.TOKEN_KEY);
    console.log('🔐 Auth tokens cleared');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return false;
    
    // Check if token is expired (with 5 minute buffer)
    return tokens.expiresAt > Date.now() + (5 * 60 * 1000);
  }

  // Get current access token, refresh if needed
  async getAccessToken(): Promise<string | null> {
    const tokens = this.getTokens();
    if (!tokens) return null;

    // If token is still valid, return it
    if (tokens.expiresAt > Date.now() + (5 * 60 * 1000)) {
      return tokens.idToken;
    }

    // If already refreshing, wait for that promise
    if (this.refreshTokenPromise) {
      try {
        console.log('🔄 Waiting for existing token refresh...');
        return await this.refreshTokenPromise;
      } catch {
        return null;
      }
    }

    // Start refresh process
    console.log('🔄 Starting token refresh...');
    this.refreshTokenPromise = this.refreshToken(tokens.refreshToken, tokens.idToken);
    try {
      const newToken = await this.refreshTokenPromise;
      this.refreshTokenPromise = null;
      console.log('✅ Token refresh successful');
      return newToken;
    } catch {
      this.refreshTokenPromise = null;
      this.clearTokens();
      return null;
    }
  }

  // Login with email and password
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    const data: LoginResponse = await response.json();
    this.setTokens(data);
    console.log('✅ Login successful');
    return data;
  }

  // Refresh access token
  private async refreshToken(refreshToken: string, currentIdToken: string): Promise<string> {
    console.log('🔄 Calling refresh token API...');
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentIdToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // If refresh token API returns 401, clear tokens and redirect to login
      if (response.status === 401) {
        console.log('❌ Refresh token expired, redirecting to login');
        this.clearTokens();
        window.location.href = '/login';
      }
      throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
    }

    const data: LoginResponse = await response.json();
    this.setTokens(data);
    console.log('✅ Token refresh successful');
    return data.idToken;
  }

  // Logout
  logout(): void {
    console.log('👋 User logged out');
    this.clearTokens();
    // Redirect to login page
    window.location.href = '/login';
  }

  // Make authenticated API request with automatic token refresh and retry logic
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getAccessToken();
    
    if (!token) {
      console.log('❌ No valid authentication token available');
      throw new Error('No valid authentication token');
    }

    // Make the initial request
    console.log(`🌐 Making API request to: ${url}`);
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    // If we get a 401, check for specific session expired error
    if (response.status === 401) {
      try {
        // Try to read the response body to check for session expired message
        const responseText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(responseText);
        } catch {
          // If JSON parsing fails, treat as regular 401
          errorData = null;
        }

        // Check if it's the specific session expired error
        if (errorData && errorData.error === "Session expired, please login again.") {
          console.log('❌ Session expired, redirecting to login');
          this.clearTokens();
          window.location.href = '/login';
          throw new Error('Session expired, please login again.');
        }

        // For other 401 errors, try to refresh the token and retry
        console.log('🔄 Got 401, attempting token refresh and retry...');
        try {
          // Get fresh tokens - this will handle concurrent refresh attempts
          const newToken = await this.getAccessToken();
          
          if (!newToken) {
            throw new Error('Failed to get new token after refresh');
          }
          
          // Retry the original request with the new token
          console.log(`🔄 Retrying API request to: ${url}`);
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newToken}`,
            },
          });

          console.log(`✅ Retry successful: ${retryResponse.status}`);
          return retryResponse;
        } catch (refreshError) {
          // If refresh fails, clear tokens and redirect to login
          console.log('❌ Token refresh failed, redirecting to login');
          this.clearTokens();
          window.location.href = '/login';
          throw new Error('Authentication failed - redirecting to login');
        }
      } catch (error) {
        // If we can't read the response body, treat as regular 401 with refresh attempt
        if (error instanceof Error && error.message === 'Session expired, please login again.') {
          // Re-throw the session expired error
          throw error;
        }
        
        // For other errors reading response, try token refresh
        console.log('🔄 Got 401, attempting token refresh and retry...');
        try {
          const newToken = await this.getAccessToken();
          
          if (!newToken) {
            throw new Error('Failed to get new token after refresh');
          }
          
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newToken}`,
            },
          });

          console.log(`✅ Retry successful: ${retryResponse.status}`);
          return retryResponse;
        } catch (refreshError) {
          console.log('❌ Token refresh failed, redirecting to login');
          this.clearTokens();
          window.location.href = '/login';
          throw new Error('Authentication failed - redirecting to login');
        }
      }
    }
    return response;
  }
}

export const authService = new AuthService(); 