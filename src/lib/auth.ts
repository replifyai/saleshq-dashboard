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

  // Get current access token (do not proactively refresh; refresh on 401 only)
  async getAccessToken(): Promise<string | null> {
    const tokens = this.getTokens();
    return tokens?.idToken ?? null;
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

  // Refresh access token (Authorization: Bearer <refreshToken>, body: { idToken })
  private async refreshToken(refreshToken: string, currentIdToken: string): Promise<string> {
    console.log('🔄 Calling refresh token API...');
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: currentIdToken }),
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
    const tokens = this.getTokens();
    if (!tokens) {
      console.log('❌ No valid authentication token available');
      throw new Error('No valid authentication token');
    }

    let attempt = 0;
    let currentToken = tokens.idToken;

    while (attempt <= 2) {
      console.log(`🌐 Making API request to: ${url} (attempt ${attempt + 1})`);
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${currentToken}`,
        },
      });

      if (response.status !== 401) {
        return response;
      }

      // 401 -> attempt refresh and retry
      attempt += 1;
      if (attempt > 2) break;

      try {
        if (this.refreshTokenPromise) {
          currentToken = await this.refreshTokenPromise;
        } else {
          this.refreshTokenPromise = this.refreshToken(tokens.refreshToken, currentToken);
          currentToken = await this.refreshTokenPromise;
          this.refreshTokenPromise = null;
        }
        // loop continues to retry request with new token
      } catch (e) {
        console.log('❌ Token refresh failed, redirecting to login');
        this.refreshTokenPromise = null;
        this.clearTokens();
        window.location.href = '/login';
        throw new Error('Authentication failed - redirecting to login');
      }
    }

    // Retries exhausted
    this.clearTokens();
    window.location.href = '/login';
    throw new Error('Authentication failed after retries');
  }
}

export const authService = new AuthService(); 