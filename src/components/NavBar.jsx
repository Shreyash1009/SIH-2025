import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronDown, Waves, Home, FileText, Trophy, BarChart3, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { currentUser, logout, loading } = useAuth();
  if (loading) {
    return null; // or a very small top-bar skeleton/spinner
  }
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Build navigation links based on user role
  const getNavLinks = () => {
    const baseLinks = [
      { path: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
      { path: "/report", label: "Report Hazard", icon: <FileText className="w-4 h-4" /> },
      { path: "/leaderboard", label: "Leaderboard", icon: <Trophy className="w-4 h-4" /> },
    ];

    // Add role-specific dashboard links
    if (currentUser) {
      if (currentUser.role === 'official' || currentUser.role === 'admin') {
        baseLinks.push({ 
          path: "/dashboard", 
          label: "Authority Dashboard", 
          icon: <Shield className="w-4 h-4" /> 
        });
      } else if (currentUser.role === 'analyst') {
        baseLinks.push({ 
          path: "/analyst-dashboard", 
          label: "Analyst Dashboard", 
          icon: <BarChart3 className="w-4 h-4" /> 
        });
      }
    }

    return baseLinks;
  };

  const navLinks = getNavLinks();

  const getRoleDisplayName = (role) => {
    switch(role) {
      case 'official': return 'Authority';
      case 'analyst': return 'Analyst';
      case 'admin': return 'Admin';
      default: return 'Guardian';
    }
  };

  return (
    <header className="gradient-ocean text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Waves className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <div className="font-bold text-lg">CoastWatch</div>
              <div className="text-xs opacity-90">Ocean Safety Network</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-all hover:bg-white/10 flex items-center gap-2 ${
                  isActive(link.path) ? "bg-white/20" : ""
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {!currentUser ? (
              <>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all"
                >
                  Sign up
                </button>
                <button
                  onClick={() => navigate('/login')}
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
                    {getRoleDisplayName(currentUser.role)}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm text-gray-900 font-medium">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Role: {getRoleDisplayName(currentUser.role)}
                      </p>
                    </div>
                    
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
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg transition-all hover:bg-white/10 flex items-center gap-2 text-left ${
                    isActive(link.path) ? "bg-white/20" : ""
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-white/20">
              {!currentUser ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all text-center"
                  >
                    Sign up
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium text-center"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <div className="px-4 py-2">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs opacity-80">{currentUser.email}</p>
                  <p className="text-xs opacity-80 mt-1">Role: {getRoleDisplayName(currentUser.role)}</p>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-white/80 hover:text-white flex items-center gap-2 transition-colors mt-2"
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
    </header>
  );
}