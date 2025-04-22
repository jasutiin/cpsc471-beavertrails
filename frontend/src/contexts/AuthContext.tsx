import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  user_email: string | null;
  user_id: string | null;
  user_name: string | null;
  user_phone_number: string | null;
}

interface Company {
  company_email: string | null;
  company_id: string | null;
  company_name: string | null;
  company_phone_number: string | null;
}

interface AuthContextType {
  user: User | null;
  company: Company | null;
  loginAsUser: (credentials: {
    email: string;
    password: string;
  }) => Promise<User>;
  loginAsCompany: (credentials: {
    email: string;
    password: string;
  }) => Promise<Company>;
  signUpAsUser: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => Promise<User>;
  signUpAsCompany: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => Promise<Company>;
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

  const [company, setCompany] = useState<Company>({
    company_email: null,
    company_id: null,
    company_name: null,
    company_phone_number: null,
  });

  const loginAsUser = async (credentials: {
    email: string;
    password: string;
  }): Promise<User> => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/user/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        throw new Error('User login failed');
      }

      const userData: User = await response.json();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('User login error:', error);
      throw error;
    }
  };

  const loginAsCompany = async (credentials: {
    email: string;
    password: string;
  }): Promise<Company> => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/company/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        throw new Error('Company login failed');
      }

      const companyData: Company = await response.json();
      console.log(companyData);
      setCompany(companyData);
      return companyData;
    } catch (error) {
      console.error('Company login error:', error);
      throw error;
    }
  };

  const signUpAsUser = async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }): Promise<User> => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/user/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('User signup failed');
      }

      const userData: User = await response.json();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('User signup error:', error);
      throw error;
    }
  };

  const signUpAsCompany = async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }): Promise<Company> => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/company/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Company signup failed');
      }

      const companyData: Company = await response.json();
      setCompany(companyData);
      return companyData;
    } catch (error) {
      console.error('Company signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser({
      user_email: null,
      user_id: null,
      user_name: null,
      user_phone_number: null,
    });
    setCompany({
      company_email: null,
      company_id: null,
      company_name: null,
      company_phone_number: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        loginAsUser,
        loginAsCompany,
        signUpAsUser,
        signUpAsCompany,
        logout,
      }}
    >
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
