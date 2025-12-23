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
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_tokens';
  private tokenRefreshCallbacks: Set<() => void> = new Set();
  
  // Request queue system for handling concurrent requests during token refresh
  private requestQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
    timestamp: number; // Track when request was queued
  }> = [];
  private isRefreshing = false;
  private refreshTimeout: NodeJS.Timeout | null = null;
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  // Configuration for queue timeout and memory management
  private readonly REFRESH_TIMEOUT_MS = 30000; // 30 seconds timeout for refresh
  private readonly QUEUE_MAX_AGE_MS = 60000; // 1 minute max age for queued requests
  private readonly MAX_QUEUE_SIZE = 50; // Maximum number of queued requests
  private readonly CLEANUP_INTERVAL_MS = 30000; // Cleanup every 30 seconds
  private readonly MAX_CALLBACKS = 20; // Maximum number of refresh callbacks

  constructor() {
    // Start automatic cleanup interval
    this.startAutomaticCleanup();
  }

  // Start automatic cleanup to prevent memory leaks
  private startAutomaticCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.cleanupInterval = setInterval(() => {
      this.performMemoryCleanup();
    }, this.CLEANUP_INTERVAL_MS);
  }

  // Stop automatic cleanup (call this when destroying the service)
  private stopAutomaticCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  // Comprehensive memory cleanup
  private performMemoryCleanup(): void {
    // Clean up expired requests
    this.clearExpiredRequests();
    
    // Clean up excessive callbacks
    this.cleanupExcessiveCallbacks();
    
    // Clean up oversized queue
    this.cleanupOversizedQueue();
    
    // Log memory status for monitoring
    this.logMemoryStatus();
  }

  // Clean up excessive refresh callbacks to prevent memory leaks
  private cleanupExcessiveCallbacks(): void {
    if (this.tokenRefreshCallbacks.size > this.MAX_CALLBACKS) {
      console.log(`🧹 Cleaning up excessive callbacks: ${this.tokenRefreshCallbacks.size} > ${this.MAX_CALLBACKS}`);
      // Keep only the most recent callbacks
      const callbacksArray = Array.from(this.tokenRefreshCallbacks);
      this.tokenRefreshCallbacks.clear();
      
      // Keep the last MAX_CALLBACKS callbacks
      callbacksArray.slice(-this.MAX_CALLBACKS).forEach(callback => {
        this.tokenRefreshCallbacks.add(callback);
      });
    }
  }

  // Clean up oversized queue to prevent memory issues
  private cleanupOversizedQueue(): void {
    if (this.requestQueue.length > this.MAX_QUEUE_SIZE) {
      console.log(`🧹 Cleaning up oversized queue: ${this.requestQueue.length} > ${this.MAX_QUEUE_SIZE}`);
      
      // Remove oldest requests first
      const excessCount = this.requestQueue.length - this.MAX_QUEUE_SIZE;
      const requestsToRemove = this.requestQueue.splice(0, excessCount);
      
      // Reject removed requests
      requestsToRemove.forEach(({ reject }) => {
        reject(new Error('Request queue overflow - request dropped'));
      });
    }
  }

  // Log memory status for monitoring
  private logMemoryStatus(): void {
    const status = this.getMemoryStatus();
    if (status.queueLength > 0 || status.callbackCount > 10) {
      console.log('📊 Memory Status:', status);
    }
  }

  // Get comprehensive memory status
  public getMemoryStatus(): {
    queueLength: number;
    callbackCount: number;
    isRefreshing: boolean;
    hasTimeout: boolean;
    hasCleanupInterval: boolean;
    memoryUsage: string;
  } {
    const now = Date.now();
    const oldestRequest = this.requestQueue.reduce((oldest, request) => {
      return request.timestamp < oldest.timestamp ? request : oldest;
    }, this.requestQueue[0]);

    return {
      queueLength: this.requestQueue.length,
      callbackCount: this.tokenRefreshCallbacks.size,
      isRefreshing: this.isRefreshing,
      hasTimeout: this.refreshTimeout !== null,
      hasCleanupInterval: this.cleanupInterval !== null,
      memoryUsage: `Queue: ${this.requestQueue.length}/${this.MAX_QUEUE_SIZE}, Callbacks: ${this.tokenRefreshCallbacks.size}/${this.MAX_CALLBACKS}`
    };
  }

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

  // Helper function to decode JWT payload without verification (browser-compatible)
  private decodeJWTPayload(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = parts[1];
      // Convert base64url to base64 by replacing characters
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      // Use atob() which is browser-compatible (instead of Buffer.from which is Node.js only)
      const decoded = atob(base64);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  // Subscribe to token refresh events
  onTokenRefresh(callback: () => void): () => void {
    this.tokenRefreshCallbacks.add(callback);
    return () => this.tokenRefreshCallbacks.delete(callback);
  }

  // Notify all subscribers about token refresh
  private notifyTokenRefresh(): void {
    this.tokenRefreshCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in token refresh callback:', error);
      }
    });
  }

  // Clear expired requests from queue based on business logic
  private clearExpiredRequests(): void {
    const now = Date.now();
    const expiredRequests = this.requestQueue.filter(
      request => (now - request.timestamp) > this.QUEUE_MAX_AGE_MS
    );
    
    if (expiredRequests.length > 0) {
      console.log(`🧹 Clearing ${expiredRequests.length} expired requests from queue`);
      expiredRequests.forEach(({ reject }) => {
        reject(new Error('Request expired while waiting for token refresh'));
      });
      
      // Remove expired requests from queue
      this.requestQueue = this.requestQueue.filter(
        request => (now - request.timestamp) <= this.QUEUE_MAX_AGE_MS
      );
    }
  }

  // Clear all queued requests (used when refresh fails or times out)
  private clearAllQueuedRequests(error: Error): void {
    console.log(`🧹 Clearing all ${this.requestQueue.length} queued requests`);
    this.requestQueue.forEach(({ reject }) => {
      reject(error);
    });
    this.requestQueue = [];
  }

  // Set up refresh timeout
  private setupRefreshTimeout(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    
    this.refreshTimeout = setTimeout(() => {
      console.log('⏰ Refresh token timeout reached');
      this.isRefreshing = false;
      this.clearAllQueuedRequests(new Error('Token refresh timeout - please try again'));
    }, this.REFRESH_TIMEOUT_MS);
  }

  // Clear refresh timeout
  private clearRefreshTimeout(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
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
    };
    
    // Set cookie to expire in 30 days
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    
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

  // Check if user is authenticated (token not expired)
  isAuthenticated(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return false;
    
    // Check if the JWT itself has expired
    try {
      const payload = this.decodeJWTPayload(tokens.idToken);
      if (!payload || !payload.exp) return false;
      
      // Check if JWT is expired (no buffer - actual expiration only)
      // Token refresh is handled on 401 responses, not here
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error decoding JWT in isAuthenticated:', error);
      return false;
    }
  }

  // Check if token needs refresh (approaching expiration within 5 minutes)
  private shouldRefreshToken(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return false;
    
    try {
      const payload = this.decodeJWTPayload(tokens.idToken);
      if (!payload || !payload.exp) return false;
      
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - currentTime;
      
      // Refresh if token expires within 5 minutes but is not yet expired
      return timeUntilExpiry > 0 && timeUntilExpiry <= (5 * 60);
    } catch (error) {
      console.error('Error checking token refresh need:', error);
      return false;
    }
  }

  // Proactively refresh token if it's about to expire
  async refreshTokenIfNeeded(): Promise<boolean> {
    if (!this.shouldRefreshToken()) {
      return false;
    }

    // Don't refresh if already in progress
    if (this.isRefreshing) {
      console.log('🔄 Token refresh already in progress');
      return false;
    }

    console.log('🔄 Token approaching expiration, refreshing proactively...');
    
    try {
      await this.getFreshToken();
      return true;
    } catch (error) {
      console.error('❌ Proactive token refresh failed:', error);
      return false;
    }
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
    
    try {
      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: currentIdToken }),
      });

      if (!response.ok) {
        // If refresh token API returns 401 or 403, the refresh token is invalid/expired
        if (response.status === 401 || response.status === 403) {
          console.log('❌ Refresh token expired or invalid, logging out user');
          this.handleSessionExpired();
          // Return a rejected promise that won't be caught as a normal error
          return Promise.reject(new Error('SESSION_EXPIRED'));
        }
        throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
      }

      const data: LoginResponse = await response.json();
      this.setTokens(data);
      this.notifyTokenRefresh(); // Notify subscribers about token refresh
      console.log('✅ Token refresh successful');
      return data.idToken;
    } catch (error) {
      // Handle network errors or other fetch failures
      if (error instanceof Error && error.message === 'SESSION_EXPIRED') {
        throw error;
      }
      console.error('❌ Network error during token refresh:', error);
      throw new Error(`Token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Handle session expiration - clear all state and redirect to login
  private handleSessionExpired(): void {
    console.log('🔒 Session expired, clearing auth state and redirecting to login');
    
    // Clear all queued requests
    this.clearRefreshTimeout();
    this.clearAllQueuedRequests(new Error('Session expired'));
    this.isRefreshing = false;
    
    // Clear tokens
    this.clearTokens();
    
    // Clear all callbacks to prevent memory leaks
    this.tokenRefreshCallbacks.clear();
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Get fresh token with proper queue management
  private async getFreshToken(): Promise<string> {
    const tokens = this.getTokens();
    if (!tokens) {
      throw new Error('No valid authentication token');
    }

    // Clear expired requests before processing
    this.clearExpiredRequests();

    // If already refreshing, queue this request
    if (this.isRefreshing) {
      console.log('🔄 Token refresh in progress, queuing request...');
      
      // Check queue size limit
      if (this.requestQueue.length >= this.MAX_QUEUE_SIZE) {
        console.log(`❌ Queue size limit reached (${this.MAX_QUEUE_SIZE}), rejecting request`);
        throw new Error('Request queue overflow - too many pending requests');
      }
      
      return new Promise((resolve, reject) => {
        this.requestQueue.push({ 
          resolve, 
          reject, 
          timestamp: Date.now() 
        });
      });
    }

    // Start refresh process
    this.isRefreshing = true;
    this.setupRefreshTimeout(); // Set up timeout
    console.log('🔄 Starting token refresh...');

    try {
      const newToken = await this.refreshToken(tokens.refreshToken, tokens.idToken);
      
      // Clear timeout and resolve all queued requests with the new token
      this.clearRefreshTimeout();
      this.requestQueue.forEach(({ resolve }) => resolve(newToken));
      this.requestQueue = [];
      
      return newToken;
    } catch (error) {
      // Clear timeout and reject all queued requests
      this.clearRefreshTimeout();
      this.clearAllQueuedRequests(error as Error);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Logout
  logout(): void {
    console.log('👋 User logged out');
    this.clearTokens();
    
    // Clear all queued requests and timeouts
    this.clearRefreshTimeout();
    this.clearAllQueuedRequests(new Error('User logged out'));
    this.isRefreshing = false;
    
    // Clear all refresh callbacks to prevent memory leaks
    this.tokenRefreshCallbacks.clear();
    
    // Redirect to login page
    window.location.href = '/login';
  }

  // Complete cleanup - call this when the service is no longer needed
  public destroy(): void {
    console.log('🗑️ Destroying AuthService - cleaning up all resources');
    
    // Stop automatic cleanup
    this.stopAutomaticCleanup();
    
    // Clear all timeouts
    this.clearRefreshTimeout();
    
    // Clear all queued requests
    this.clearAllQueuedRequests(new Error('Service destroyed'));
    
    // Clear all callbacks
    this.tokenRefreshCallbacks.clear();
    
    // Clear tokens
    this.clearTokens();
    
    // Reset state
    this.isRefreshing = false;
    this.requestQueue = [];
  }

  // Periodic cleanup of expired requests (call this periodically)
  public cleanupExpiredRequests(): void {
    if (this.requestQueue.length > 0) {
      this.clearExpiredRequests();
    }
  }

  // Get queue status for monitoring and debugging
  public getQueueStatus(): {
    isRefreshing: boolean;
    queueLength: number;
    oldestRequestAge: number;
    hasTimeout: boolean;
  } {
    const now = Date.now();
    const oldestRequest = this.requestQueue.reduce((oldest, request) => {
      return request.timestamp < oldest.timestamp ? request : oldest;
    }, this.requestQueue[0]);

    return {
      isRefreshing: this.isRefreshing,
      queueLength: this.requestQueue.length,
      oldestRequestAge: oldestRequest ? now - oldestRequest.timestamp : 0,
      hasTimeout: this.refreshTimeout !== null
    };
  }

  // Make authenticated API request with automatic token refresh and retry logic
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const tokens = this.getTokens();
    if (!tokens) {
      console.log('❌ No valid authentication token available');
      throw new Error('No valid authentication token');
    }

    // Check if this is a refresh API call
    const isRefreshCall = url.includes('/refresh');
    
    let currentToken = tokens.idToken;

    // First attempt with current token
    console.log(`🌐 Making API request to: ${url}`);
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${currentToken}`,
      },
    });

    // If successful, return immediately
    if (response.status !== 401) {
      return response;
    }

    // If this is a refresh call, don't retry - session has expired
    if (isRefreshCall) {
      console.log('❌ Refresh token call failed');
      this.handleSessionExpired();
      throw new Error('Authentication failed - session expired');
    }

    // 401 response - need to refresh token and retry
    console.log('🔄 Token expired, refreshing...');
    
    try {
      // Get fresh token (this will queue requests if refresh is in progress)
      currentToken = await this.getFreshToken();
      
      // Retry the original request with new token
      console.log(`🔄 Retrying API request to: ${url} with fresh token`);
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${currentToken}`,
        },
      });

      return response;
    } catch (error) {
      // Check if this is a session expired error (already handled)
      if (error instanceof Error && error.message === 'SESSION_EXPIRED') {
        throw new Error('Authentication failed - session expired');
      }
      
      console.log('❌ Token refresh failed');
      this.handleSessionExpired();
      throw new Error('Authentication failed - session expired');
    }
  }
}

export const authService = new AuthService(); 