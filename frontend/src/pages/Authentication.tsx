import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isCompany, setIsCompany] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const {
    loginAsUser,
    loginAsCompany,
    signUpAsUser,
    signUpAsCompany,
    user,
    company,
  } = useAuth();
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', phone: '' });
  };

  const toggleRole = () => setIsCompany(!isCompany);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const credentials = {
          email: formData.email,
          password: formData.password,
        };

        if (isCompany) {
          const companyData = await loginAsCompany(credentials);
          if (companyData.company_id) {
            navigate(`/dashboard/${companyData.company_id}`);
          }
        } else {
          await loginAsUser(credentials);
          navigate('/');
        }
      } else {
        const signupData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        };

        if (isCompany) {
          const companyData = await signUpAsCompany(signupData);
          if (companyData.company_id) {
            navigate(`/dashboard/${companyData.company_id}`);
          }
        } else {
          await signUpAsUser(signupData);
          navigate('/');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        alert(error.message);
      } else {
        console.error('An unknown error occurred');
        alert('An unknown error occurred');
      }
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-6">
          <h1 className="text-2xl font-semibold mb-2 text-center">
            {isLogin
              ? isCompany
                ? 'Login as Company'
                : 'Login as User'
              : isCompany
              ? 'Sign Up as Company'
              : 'Sign Up as User'}
          </h1>

          <div className="mb-4 text-center text-sm">
            <button
              type="button"
              onClick={toggleRole}
              className="text-blue-600 hover:underline"
            >
              {isCompany ? 'Switch to User' : 'Switch to Company'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="name">
                    {isCompany ? 'Company Name' : 'Name'}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={isCompany ? 'Company name' : 'Your name'}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">
                    {isCompany ? 'Company Phone' : 'Phone'}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="123-456-7890"
                    required
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email">
                {isCompany ? 'Company Email' : 'Email'}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={
                  isCompany ? 'company@example.com' : 'you@example.com'
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {isLogin
                ? isCompany
                  ? 'Login as Company'
                  : 'Login as User'
                : isCompany
                ? 'Sign Up as Company'
                : 'Sign Up as User'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={toggleForm}
              className="text-blue-600 hover:underline"
            >
              {isLogin ? 'Sign up here' : 'Login here'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
