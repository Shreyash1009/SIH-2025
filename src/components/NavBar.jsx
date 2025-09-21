import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronDown, Waves, Home, FileText, Trophy, BarChart3 } from "lucide-react";

export default function NavBar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Load user data from localStorage
  useEffect(() => {
    const checkAuth = () => {
      const userLoggedIn = localStorage.getItem('userLoggedIn');
      const userData = localStorage.getItem('userData');
      
      if (userLoggedIn === 'true' && userData) {
        try {
          setCurrentUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Clear invalid data
          localStorage.removeItem('userLoggedIn');
          localStorage.removeItem('userData');
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    checkAuth();
    
    // Listen for storage changes to update auth state across tabs
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    // Clear all user data
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('savedEmail');
    
    setCurrentUser(null);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    
    alert("Logged out successfully!");
    
    // Navigate to home page
    navigate('/');
  };

  const handleNavClick = (path, label) => {
    // Handle dashboard access control
    if (path === '/dashboard' && currentUser?.role !== 'admin') {
      alert("Access denied! Dashboard is only available for Authority users.");
      return;
    }
    
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleAuthRedirect = (page) => {
    if (page === 'login') {
      navigate('/login');
    } else if (page === 'signup') {
      navigate('/signup');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { path: "/report", label: "Report", icon: <FileText className="w-4 h-4" /> },
    { path: "/leaderboard", label: "Leaderboard", icon: <Trophy className="w-4 h-4" /> },
    { path: "/dashboard", label: "Dashboard", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="gradient-ocean text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('/', 'Home')}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center" style={{ animation: "float 3s ease-in-out infinite" }}>
                <Waves className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-white/20 rounded-full blur-md"></div>
            </div>
            <div>
              <div className="font-bold text-lg">CoastWatch</div>
              <div className="text-xs opacity-90">Ocean Safety Network</div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path, link.label)}
                className={`px-4 py-2 rounded-lg transition-all hover:bg-white/10 flex items-center gap-2 ${
                  isActive(link.path) ? "bg-white/20" : ""
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {!currentUser ? (
              <>
                <button
                  onClick={() => handleAuthRedirect('signup')}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all"
                >
                  Sign up
                </button>
                <button
                  onClick={() => handleAuthRedirect('login')}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium"
                >
                  Login
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>{currentUser.name}</span>
                  <span className="text-xs opacity-80 bg-white/20 px-2 py-1 rounded-full">
                    {currentUser.role === 'admin' ? 'Authority' : 'Guardian'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl overflow-hidden" style={{ animation: "slideUp 0.2s ease-out" }}>
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm text-gray-900 font-medium">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Role: {currentUser.role === 'admin' ? 'Authority' : 'Community Guardian'}
                      </p>
                    </div>
                    
                    {currentUser.role === 'admin' && (
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-green-700">
                          <BarChart3 className="w-4 h-4" />
                          <span>Dashboard Access Granted</span>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20" style={{ animation: "slideUp 0.2s ease-out" }}>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path, link.label)}
                  className={`px-4 py-2 rounded-lg transition-all hover:bg-white/10 flex items-center gap-2 text-left ${
                    isActive(link.path) ? "bg-white/20" : ""
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {link.path === '/dashboard' && currentUser?.role !== 'admin' && (
                    <span className="text-xs bg-red-500/80 px-2 py-1 rounded-full ml-auto">
                      Restricted
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-white/20">
              {!currentUser ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleAuthRedirect('signup');
                    }}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all text-center"
                  >
                    Sign up
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleAuthRedirect('login');
                    }}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium text-center"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <div className="px-4 py-2">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs opacity-80">{currentUser.email}</p>
                  <p className="text-xs opacity-80 mb-2">
                    {currentUser.role === 'admin' ? 'Authority' : 'Community Guardian'}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-white/80 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}