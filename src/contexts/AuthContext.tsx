import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authAPI, type User, type LoginCredentials, type RegisterData } from '../api/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginAttempts: number;
  isLocked: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  const [loading, setLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  // Check for lockout on mount
  useEffect(() => {
    const storedLockoutTime = localStorage.getItem('lockoutTime');
    if (storedLockoutTime) {
      const lockoutTimestamp = parseInt(storedLockoutTime);
      const now = Date.now();
      
      if (now < lockoutTimestamp) {
        setIsLocked(true);
        setLockoutTime(lockoutTimestamp);
        
        const timeUntilUnlock = lockoutTimestamp - now;
        setTimeout(() => {
          setIsLocked(false);
          setLoginAttempts(0);
          localStorage.removeItem('lockoutTime');
          localStorage.removeItem('loginAttempts');
        }, timeUntilUnlock);
      } else {
        localStorage.removeItem('lockoutTime');
        localStorage.removeItem('loginAttempts');
      }
    }
    
    const storedAttempts = localStorage.getItem('loginAttempts');
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts));
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(() => {
      refreshAccessToken();
    }, 45 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [token]);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          setToken(storedToken);
        } catch (error: any) {
          if (error.response?.status === 401) {
            // Try to refresh token
            const storedRefreshToken = localStorage.getItem('refreshToken');
            if (storedRefreshToken) {
              try {
                const response = await authAPI.refreshToken(storedRefreshToken);
                localStorage.setItem('token', response.token);
                setToken(response.token);
                // Retry getCurrentUser with new token
                const userData = await authAPI.getCurrentUser();
                setUser(userData);
              } catch (refreshError) {
                // Refresh failed, logout
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                setToken(null);
                setRefreshToken(null);
                setUser(null);
              }
            } else {
              // No refresh token, logout
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              setToken(null);
              setRefreshToken(null);
              setUser(null);
            }
          } else {
            // Other error, logout
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setToken(null);
            setRefreshToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) return;

      const response = await authAPI.refreshToken(storedRefreshToken);
      localStorage.setItem('token', response.token);
      setToken(response.token);
    } catch (error) {
      logout();
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (isLocked) {
      const remainingTime = Math.ceil((lockoutTime! - Date.now()) / 60000);
      toast.error(`Account locked. Try again in ${remainingTime} minutes.`);
      throw new Error('Account locked');
    }

    try {
      const response = await authAPI.login({ email, password });
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken || '');
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lockoutTime');
      
      setToken(response.token);
      setRefreshToken(response.refreshToken || null);
      setUser(response.user);
      setLoginAttempts(0);
      
      toast.success('Login successful!');
    } catch (error: any) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockoutTimestamp = Date.now() + LOCKOUT_DURATION;
        setIsLocked(true);
        setLockoutTime(lockoutTimestamp);
        localStorage.setItem('lockoutTime', lockoutTimestamp.toString());
        toast.error('Too many failed attempts. Account locked for 15 minutes.');
      } else {
        const remainingAttempts = MAX_LOGIN_ATTEMPTS - newAttempts;
        toast.error(`Invalid credentials. ${remainingAttempts} attempts remaining.`);
      }
      
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    const password = userData.password;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      throw new Error('Weak password');
    }
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      toast.error('Password must contain uppercase, lowercase, and numbers');
      throw new Error('Weak password');
    }

    try {
      const response = await authAPI.register(userData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken || '');
      setToken(response.token);
      setRefreshToken(response.refreshToken || null);
      setUser(response.user);
      
      toast.success('Registration successful!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await authAPI.updateProfile(userData);
      setUser(response.user);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    user,
    token,
    refreshToken,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshAccessToken,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loginAttempts,
    isLocked
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};