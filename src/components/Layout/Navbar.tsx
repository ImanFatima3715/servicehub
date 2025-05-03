
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import logo from "/logo.png"; // We'll create this logo later

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, logout } = useAuth();
  const { isAuthenticated, user } = state;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/", public: true },
    { name: "Services", path: "/services", public: true },
    { name: "Dashboard", path: "/dashboard", public: false },
    { name: "Emergency", path: "/emergency", public: false, roles: ["seeker"] },
  ];

  // Filter navItems based on authentication status and user role
  const filteredNavItems = navItems.filter(item => 
    (item.public || isAuthenticated) && 
    (!item.roles || (user && item.roles.includes(user.role)))
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <div className="flex items-center">
                  <img className="h-8 w-auto" src={logo} alt="Service Hub Logo" />
                  <span className="ml-2 text-xl font-bold text-primary">SERVICE HUB</span>
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="border-transparent text-gray-700 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {!isAuthenticated ? (
              <div className="flex space-x-4">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
                      {user?.profileImage ? (
                        <img 
                          src={`http://localhost:5000/${user.profileImage}`} 
                          alt={user.name} 
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </div>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block pl-3 pr-4 py-2 border-l-4 text-gray-600 hover:bg-gray-50 hover:border-primary hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary text-white">
                      {user?.profileImage ? (
                        <img 
                          src={`http://localhost:5000/${user.profileImage}`} 
                          alt={user.name} 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6" />
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user?.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:text-primary hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:text-primary hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
