import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/auth/google/callback';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add helper function for Google authentication
const authenticateWithGoogle = async (idToken: string) => {
  try {
    const response = await axiosInstance.post('/auth/google/login', { idToken });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Google authentication error:', error);
    throw error;
  }
};

// Add helper function for Google registration
const registerWithGoogle = async (idToken: string, role: 'seeker' | 'provider') => {
  try {
    const response = await axiosInstance.post('/auth/google/register', { 
      idToken,
      role 
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Google registration error:', error);
    throw error;
  }
};

export { authenticateWithGoogle, registerWithGoogle };
export default axiosInstance;
