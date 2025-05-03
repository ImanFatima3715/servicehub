import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth, LoginFormData } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const { state, loginUser, googleAuth } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(formData);
    } catch (err) {
      toast.error("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse?.credential) {
      try {
        // Pass the Google credential (token) to the googleAuth function
        await googleAuth(credentialResponse.credential);
      } catch (err) {
        toast.error("Google login failed. Please try again.");
      }
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In was unsuccessful.");
  };

  if (state.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="container flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Login Button without clientId */}
            <GoogleLogin 
              onSuccess={handleGoogleSuccess} 
              onError={handleGoogleError} 
            />

            <div className="mt-4 text-center">
              <Link to="/admin/login" className="text-sm text-primary hover:underline">
                Login as Administrator
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
