import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth, RegisterFormData } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // ✅ Add this
import { toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
  const { state, registerUser, googleAuth } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    role: 'seeker',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Add this handler for the radio buttons
  const handleRoleChange = (role: 'seeker' | 'provider') => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse?.credential) {
      try {
        await googleAuth(credentialResponse.credential);
      } catch (err) {
        toast.error("Google register failed. Please try again.");
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
            <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Sign up to start using our services
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                />
              </div>

              <div className="space-y-3">
                <Label>I want to register as</Label>
                <RadioGroup
                  defaultValue="seeker"
                  value={formData.role}
                  onValueChange={(value) => handleRoleChange(value as 'seeker' | 'provider')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="seeker" id="seeker" />
                    <Label htmlFor="seeker" className="cursor-pointer">Service Seeker</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="provider" id="provider" />
                    <Label htmlFor="provider" className="cursor-pointer">Service Provider</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
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

            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

            <div className="mt-4 text-center">
              <Link to="/admin/login" className="text-sm text-primary hover:underline">
                Login as Administrator
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
