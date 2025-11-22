import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(email);
    if (success) {
      navigate('/');
    } else {
      setError('Login failed. User not found or suspended. Try "admin@nexus.com" or "reader@nexus.com"');
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 font-serif">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or <Link to="/register" className="font-medium text-primary hover:text-blue-600">create a new account</Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password (any)"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign in
            </button>
          </div>
          
          <div className="mt-6">
             <p className="text-xs text-gray-500 text-center">Demo Users:</p>
             <div className="flex justify-center space-x-4 mt-2 text-xs">
                <button type="button" onClick={() => setEmail('admin@nexus.com')} className="text-blue-600 underline">admin@nexus.com</button>
                <button type="button" onClick={() => setEmail('reader@nexus.com')} className="text-blue-600 underline">reader@nexus.com</button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
};
