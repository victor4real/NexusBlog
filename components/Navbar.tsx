import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, Shield, LogOut, Search } from 'lucide-react';
import { CATEGORIES } from '../constants';

export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isModerator } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo & Desktop Nav */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-serif font-bold text-2xl text-gray-900 tracking-tight">
                Nexus<span className="text-primary">News</span>
              </span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {CATEGORIES.map(cat => (
                <Link 
                  key={cat.id} 
                  to={`/category/${cat.slug}`} 
                  className="text-gray-500 hover:text-primary px-1 py-2 text-sm font-medium transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-400 hover:text-gray-600">
              <Search className="w-5 h-5" />
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {(isAdmin || isModerator) && (
                  <Link 
                    to="/admin" 
                    className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-semibold text-gray-700 transition-colors"
                  >
                    <Shield className="w-3 h-3 mr-1.5" />
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-2 border-l pl-4 border-gray-200">
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                    <button 
                      onClick={handleLogout}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-500 hover:text-gray-900 font-medium text-sm">
                  Log in
                </Link>
                <Link to="/register" className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="pt-2 pb-3 space-y-1 px-4">
             {CATEGORIES.map(cat => (
                <Link 
                  key={cat.id} 
                  to={`/category/${cat.slug}`} 
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
          </div>
          <div className="pt-4 pb-4 border-t border-gray-200 px-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center mb-3">
                  <div className="ml-2">
                    <div className="text-base font-medium text-gray-800">{user?.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                  </div>
                </div>
                 {(isAdmin || isModerator) && (
                  <Link 
                    to="/admin" 
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  to="/login" 
                  className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
