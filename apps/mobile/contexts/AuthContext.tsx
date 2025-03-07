import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '@/api';
import { User } from 'shared';
import useHealthStore from '@/store/healthStore';

interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  showHealthPrompt: boolean;
  setShowHealthPrompt: (show: boolean) => void;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, name?: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [showHealthPrompt, setShowHealthPrompt] = useState<boolean>(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          // Fetch user profile
          try {
            const profile = await authService.getProfile();
            setUser(profile);
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
            // Don't set unauthenticated here - token might still be valid but profile fetch failed
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await authService.login(email, password);
      
      // Small delay to ensure token is stored
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setIsAuthenticated(true);
      setUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    
    try {
      const response = await authService.register(email, password, name);
      
      // Small delay to ensure token is stored
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setIsAuthenticated(true);
      setUser(response.user);
      
      // Show health prompt after successful registration
      setShowHealthPrompt(true);
      
      return response;
    } catch (error) {
      console.error('Register error:', error);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        showHealthPrompt,
        setShowHealthPrompt,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);