'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  authenticateUser,
  createUser,
  logoutUser,
  getCurrentUser,
  resetPassword,
} from '@/lib/auth';

// Define types
interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message?: string }>;
}

// Auth context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state when component mounts
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to initialize auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authenticateUser(email, password);
      if (result.success) {
        setUser(result.user);
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const result = await createUser(name, email, password);
      if (result.success) {
        // Don't auto-login after signup
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    } finally {
      setLoading(false);
    }
  };

  // Password reset function
  const requestPasswordReset = async (email: string) => {
    setLoading(true);
    try {
      const result = await resetPassword(email);
      return { success: result.success };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    logoutUser();
    setUser(null);
  };

  // The auth context value
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    requestPasswordReset,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
