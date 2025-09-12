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
      // 模拟登录验证
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 简单的测试账号验证
      if (username === 'admin@test.com' && password === 'admin123') {
        const user = {
          id: '1',
          username: 'admin@test.com',
          name: 'Admin User',
          role: 'admin'
        };
        setAdminUser(user);
        setIsAdmin(true);
        localStorage.setItem('adminUser', JSON.stringify(user));
      } else {
        setError('Invalid username or password');
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
  };

  const clearError = () => {
    setError(null);
  };

  // 检查本地存储中的用户信息
  React.useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAdminUser(user);
        setIsAdmin(true);
      } catch (err) {
        localStorage.removeItem('adminUser');
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
