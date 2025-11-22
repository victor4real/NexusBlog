import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-white">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:slug" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Static Pages Fallbacks */}
            <Route path="/about" element={<div className="p-10 text-center">About Page Placeholder</div>} />
            <Route path="/contact" element={<div className="p-10 text-center">Contact Page Placeholder</div>} />
            <Route path="/privacy" element={<div className="p-10 text-center">Privacy Policy Placeholder</div>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
