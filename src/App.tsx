import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminLogin from './pages/Auth/AdminLogin';

// Public Pages
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    // Wrap the entire app with GoogleOAuthProvider and provide the clientId globally
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
