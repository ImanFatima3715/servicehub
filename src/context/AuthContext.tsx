
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { User, AuthState } from '@/lib/types';
import axiosInstance, { authenticateWithGoogle } from '@/lib/axios';

// Define action types
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'REGISTER_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'AUTH_ERROR' | 'LOGIN_FAIL' | 'REGISTER_FAIL' | 'LOGOUT'; payload?: string }
  | { type: 'USER_LOADED'; payload: User }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING' }
  | { type: 'GOOGLE_AUTH_SUCCESS'; payload: { token: string; user: User } };

// Define auth context properties
interface AuthContextProps {
  state: AuthState;
  loadUser: () => Promise<void>;
  registerUser: (formData: RegisterFormData) => Promise<void>;
  loginUser: (formData: LoginFormData) => Promise<void>;
  logout: () => void;
  googleAuth: (idToken: string, isRegistration?: boolean, role?: 'seeker' | 'provider') => Promise<void>;
}

// Define form types
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: 'seeker' | 'provider';
}

export interface LoginFormData {
  email: string;
  password: string;
}

// Initial state
const initialState: AuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: true,
      };
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
    case 'GOOGLE_AUTH_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: action.payload || 'Authentication failed',
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        user: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user data if token exists
  const loadUser = async (): Promise<void> => {
    if (!localStorage.token) {
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }

    try {
      const res = await axiosInstance.get('/users/me');
      dispatch({
        type: 'USER_LOADED',
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Register new user
  const registerUser = async (formData: RegisterFormData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axiosInstance.post('/auth/register', formData);
      
      // After registration, login user
      const loginRes = await axiosInstance.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          token: loginRes.data.token,
          user: res.data
        }
      });
      
      toast.success('Registration successful!');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Registration failed';
      dispatch({
        type: 'REGISTER_FAIL',
        payload: errMsg,
      });
      toast.error(errMsg);
    }
  };

  // Login user
  const loginUser = async (formData: LoginFormData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axiosInstance.post('/auth/login', formData);
      
      // Get user data
      const userRes = await axiosInstance.get('/users/me', {
        headers: {
          'x-auth-token': res.data.token
        }
      });
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: res.data.token,
          user: userRes.data
        }
      });
      
      toast.success('Login successful!');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Invalid credentials';
      dispatch({
        type: 'LOGIN_FAIL',
        payload: errMsg,
      });
      toast.error(errMsg);
    }
  };

  // Google authentication (for both login and signup)
  const googleAuth = async (idToken: string, isRegistration = false, role?: 'seeker' | 'provider'): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      let endpoint = '/auth/google/login';
      let payload: any = { idToken };
      
      // If it's registration, we need to include the role 
      if (isRegistration && role) {
        endpoint = '/auth/google/register';
        payload = { idToken, role };
      }
      
      const res = await axiosInstance.post(endpoint, payload);
      
      dispatch({
        type: 'GOOGLE_AUTH_SUCCESS',
        payload: {
          token: res.data.token,
          user: res.data.user
        }
      });
      
      toast.success(isRegistration ? 'Registration successful!' : 'Login successful!');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Google authentication failed';
      dispatch({
        type: 'LOGIN_FAIL',
        payload: errMsg,
      });
      toast.error(errMsg);
    }
  };

  // Log out
  const logout = (): void => {
    dispatch({ type: 'LOGOUT' });
    toast.info('You have been logged out');
  };

  // Load user on initial render if token exists
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        loadUser,
        registerUser,
        loginUser,
        logout,
        googleAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for accessing auth context
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
