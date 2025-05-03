
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginFormData {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const { state, loginUser } = useAuth();
  const [formData, setFormData] = useState<AdminLoginFormData>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // If user is already authenticated as admin, redirect to admin dashboard
  if (state.isAuthenticated && state.user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }

  // If authenticated but not admin, redirect to home
  if (state.isAuthenticated && state.user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(formData);
      
      // After login, check if user is admin
      if (state.user?.role !== 'admin') {
        toast.error('Access denied. Admin credentials required.');
        // Logout if not admin
        // Note: This would be handled by the backend in a real app
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="border shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter admin password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In as Admin'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
