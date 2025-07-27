import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { appLogin, appSignup, appGoogleLogin, appLogout } from '../api/auth';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  googleLogin: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('AuthContext: Checking authentication...')
        // You can add a "me" endpoint to verify the current user's session
        // For now, we'll check if there's a user in localStorage
        const storedUser = localStorage.getItem('user');
        console.log('AuthContext: Stored user from localStorage:', storedUser)
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('AuthContext: Parsed user:', parsedUser)
          setUser(parsedUser);
        } else {
          console.log('AuthContext: No stored user found')
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        console.log('AuthContext: Setting isLoading to false')
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await appLogin(email, password);
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    try {
      const response = await appSignup(email, name, password);
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const googleLogin = async (accessToken: string) => {
    try {
      const response = await appGoogleLogin(accessToken);
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await appLogout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    googleLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 