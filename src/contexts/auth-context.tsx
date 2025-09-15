'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, LoginRequest } from '@/lib/auth';
import { profileApi, UserProfile } from '@/lib/apiUtils';

// Helper function to decode JWT payload
function decodeJWTPayload(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  user: UserProfile | null;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  const fetchUserProfile = async () => {
    // Always prioritize JWT token data for user role and basic info
    const tokens = authService.getTokens();
    if (tokens) {
      try {
        const payload = decodeJWTPayload(tokens.idToken);
        if (payload) {
          const userFromToken = {
            uid: payload.user_id || payload.sub,
            email: payload.email,
            name: payload.name || payload.email?.split('@')[0] || 'User',
            role: payload.role || 'user', // Always use role from JWT token
            createdAt: {
              _seconds: Math.floor(Date.now() / 1000),
              _nanoseconds: 0
            }
          };
          
          // Try to enhance with API data, but keep JWT role
          try {
            const profileData = await profileApi.getUserProfile();
            setUser({
              ...profileData,
              role: userFromToken.role // Always override API role with JWT role
            });
            console.log('✅ User profile loaded with JWT role:', userFromToken.role);
          } catch (apiError) {
            console.log('⚠️ API profile fetch failed, using JWT data only');
            setUser(userFromToken);
          }
          return;
        }
      } catch (tokenError) {
        console.error('Error decoding JWT token:', tokenError);
        // If token is malformed, clear it
        authService.clearTokens();
        setIsAuthenticated(false);
        setUser(null);
        return;
      }
    }
    
    // If no valid token, clear auth state
    setIsAuthenticated(false);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (isAuthenticated) {
      await fetchUserProfile();
    }
  };

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      try {
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          await fetchUserProfile();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      await authService.login(credentials);
      setIsAuthenticated(true);
      
      // Fetch full user profile after successful login
      await fetchUserProfile();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    user,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 