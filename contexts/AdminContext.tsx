import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  isAuthenticated: boolean;
  adminUser: any | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the actual admin login API
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.admin;
        const token = data.token;
        
        setAdminUser(user);
        setIsAdmin(true);
        localStorage.setItem('adminUser', JSON.stringify(user));
        localStorage.setItem('adminToken', token);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAdminUser(null);
    setIsAdmin(false);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
  };

  const clearError = () => {
    setError(null);
  };

  // 检查本地存储中的用户信息
  React.useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    const savedToken = localStorage.getItem('adminToken');
    
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        setAdminUser(user);
        setIsAdmin(true);
      } catch (err) {
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
      }
    }
  }, []);

  const value = {
    isAdmin,
    isAuthenticated: isAdmin,
    adminUser,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
