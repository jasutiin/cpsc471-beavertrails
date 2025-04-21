import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  user_email: string | null;
  user_id: string | null;
  user_name: string | null;
  user_phone_number: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    user_email: null,
    user_id: null,
    user_name: null,
    user_phone_number: null,
  });

  const login = async (credentials: { email: string; password: string }) => {
    console.log(credentials.email, credentials.password);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const userData: User = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    setUser({
      user_email: null,
      user_id: null,
      user_name: null,
      user_phone_number: null,
    });
    console.log(user);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
