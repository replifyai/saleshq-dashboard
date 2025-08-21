'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, LoginRequest } from '@/lib/auth';
import { profileApi, UserProfile } from '@/lib/apiUtils';

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
    try {
      const profileData = await profileApi.getUserProfile();
      setUser(profileData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // If profile fetch fails, fallback to token data
      const tokens = authService.getTokens();
      if (tokens) {
        try {
          const payload = JSON.parse(atob(tokens.idToken.split('.')[1]));
          setUser({
            uid: payload.user_id || payload.sub,
            email: payload.email,
            name: payload.name || payload.email.split('@')[0],
            role: payload.role || 'user',
            createdAt: {
              _seconds: Math.floor(Date.now() / 1000),
              _nanoseconds: 0
            }
          });
        } catch {
          // If token is malformed, clear it
          authService.clearTokens();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    }
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