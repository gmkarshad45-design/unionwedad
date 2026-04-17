/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { loginWithGoogle } from './firebase';
import { useWedadAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Programs from './pages/Programs';
import IndividualResult from './pages/IndividualResult';
import Wings from './pages/Wings';
import { LogIn, LogOut, ShieldCheck, Home as HomeIcon, Trophy, ClipboardList, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

// Error Boundary as per critical directives
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorJson?: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // @ts-ignore
  props: ErrorBoundaryProps;
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    try {
      const parsed = JSON.parse(error.message);
      return { hasError: true, errorJson: parsed };
    } catch {
      return { hasError: true, errorJson: { error: error.message } };
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <h2 className="text-2xl font-serif font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-stone-600 mb-6 font-medium">
              {this.state.errorJson?.error?.includes('permission') 
                ? "You don't have permission to perform this action. Please check if you are logged in with the admin account."
                : "An unexpected error occurred while loading the application."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-academy-green text-white rounded-xl hover:bg-emerald-900 transition-colors font-semibold"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import LoginModal from './components/LoginModal';

// ... (ErrorBoundary remains same)

function Navigation() {
  const { memberUser, adminUser, isAdmin, logoutAll, isLoggedIn } = useWedadAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-academy-green rounded-full flex items-center justify-center text-academy-gold font-serif font-bold">W</div>
            <span className="font-serif font-bold text-lg text-academy-green tracking-tight hidden sm:block">Wedad Union</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <Link to="/programs" className={`text-sm font-semibold flex items-center gap-1.5 ${location.pathname === '/programs' ? 'text-academy-green' : 'text-stone-500 hover:text-academy-green'}`}>
              <ClipboardList size={16} /> Result & Program
            </Link>
            <Link to="/individual-result" className={`text-sm font-semibold flex items-center gap-1.5 ${location.pathname === '/individual-result' ? 'text-academy-green' : 'text-stone-500 hover:text-academy-green'}`}>
              <Trophy size={16} /> Individual Result
            </Link>
            <Link to="/wings" className={`text-sm font-semibold flex items-center gap-1.5 ${location.pathname === '/wings' ? 'text-academy-green' : 'text-stone-500 hover:text-academy-green'}`}>
              <TrendingUp size={16} /> Wings
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              className={`p-2 rounded-lg transition-colors ${location.pathname === '/' ? 'text-academy-green bg-stone-100' : 'text-stone-500 hover:text-academy-green'}`}
            >
              <HomeIcon size={20} />
            </Link>
            
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${location.pathname === '/admin' ? 'bg-academy-green text-white' : 'text-stone-600 hover:bg-stone-100'}`}
              >
                <ShieldCheck size={18} />
                <span className="text-sm font-medium hidden sm:block">Admin</span>
              </Link>
            )}

            <div className="h-6 w-px bg-stone-200 mx-1" />

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <div className="text-xs font-bold text-academy-green line-clamp-1 truncate w-24">
                    {memberUser ? memberUser.name : adminUser?.username}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-stone-400">
                    {memberUser ? memberUser.category : 'System Admin'}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    logoutAll();
                    navigate('/');
                  }}
                  className="p-2 text-stone-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-2 bg-academy-green text-white px-5 py-2 rounded-full hover:bg-emerald-900 transition-all shadow-sm active:scale-95"
              >
                <LogIn size={18} />
                <span className="text-sm font-semibold">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </nav>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-academy-paper">
          <Navigation />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/individual-result" element={<IndividualResult />} />
              <Route path="/wings" element={<Wings />} />
            </Routes>
          </main>

          <footer className="bg-academy-green text-stone-300 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="font-serif text-2xl text-white mb-2">Wedad Union Official</div>
              <div className="text-sm text-stone-400 mb-6">Noorul Huda Islamic Academy, Madanoor</div>
              <div className="flex justify-center flex-wrap gap-8 text-xs uppercase tracking-widest font-semibold text-stone-500">
                <Link to="/" className="hover:text-academy-gold transition-colors">Home</Link>
                <Link to="/programs" className="hover:text-academy-gold transition-colors">Programs</Link>
                <Link to="/individual-result" className="hover:text-academy-gold transition-colors">Results</Link>
                <Link to="/wings" className="hover:text-academy-gold transition-colors">Wings</Link>
                <Link to="/admin" className="hover:text-academy-gold transition-colors">Admin</Link>
              </div>
              <div className="mt-12 text-[10px] text-stone-600 uppercase tracking-widest">
                © {new Date().getFullYear()} Wedad Union. All Rights Reserved.
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  );
}
