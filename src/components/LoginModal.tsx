import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Phone, User as UserIcon, ShieldCheck, Hash } from 'lucide-react';
import { useWedadAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [tab, setTab] = useState<'student' | 'admin'>('student');
  const { loginMember, loginAdmin } = useWedadAuth();
  
  const [identifier, setIdentifier] = useState(''); // Admission No or Username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let success = false;
      if (tab === 'student') {
        success = await loginMember(identifier, password);
      } else {
        success = await loginAdmin(identifier, password);
      }
      
      if (success) {
        onClose();
        setIdentifier('');
        setPassword('');
      } else {
        setError('Invalid credentials. Please check and try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[70] px-4"
          >
            <div className={`bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border transition-colors duration-500 ${tab === 'admin' ? 'border-amber-100 shadow-amber-900/10' : 'border-emerald-50 shadow-emerald-900/5'}`}>
              <div className="relative p-8 pb-0">
                <button 
                  onClick={onClose}
                  className="absolute right-6 top-6 p-2 rounded-full hover:bg-stone-50 transition-colors text-stone-400 hover:text-stone-600"
                >
                  <X size={20} />
                </button>
                
                <div className="flex items-center gap-4 mb-8">
                  <motion.div 
                    layout
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${tab === 'admin' ? 'bg-amber-500 text-white' : 'bg-academy-green text-academy-gold'}`}
                  >
                    {tab === 'student' ? <UserIcon size={24} /> : <ShieldCheck size={24} />}
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-academy-green">
                      {tab === 'student' ? 'Student Portal' : 'Official Login'}
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                      {tab === 'student' ? 'Access your records' : 'Authorized Personnel Only'}
                    </p>
                  </div>
                </div>

                <div className="mb-2 ml-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Login Type</span>
                </div>
                <div className="flex p-2 bg-stone-100/80 rounded-[1.5rem] mb-8 relative border border-stone-200">
                  <motion.div 
                    layoutId="activeTab"
                    className={`absolute inset-y-1.5 rounded-xl shadow-lg z-0 transition-colors duration-500 ${tab === 'admin' ? 'bg-stone-800' : 'bg-white'}`}
                    style={{ 
                      left: tab === 'student' ? '6px' : '50%', 
                      width: 'calc(50% - 9px)' 
                    }}
                    transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                  />
                  <button 
                    type="button"
                    onClick={() => { setTab('student'); setError(''); }}
                    className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-[0.1em] relative z-10 transition-all duration-300 ${tab === 'student' ? 'text-academy-green scale-105' : 'text-stone-400 hover:text-stone-600'}`}
                  >
                    Student
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setTab('admin'); setError(''); }}
                    className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-[0.1em] relative z-10 transition-all duration-300 ${tab === 'admin' ? 'text-white scale-105' : 'text-stone-400 hover:text-stone-600'}`}
                  >
                    Admin Access
                  </button>
                </div>
              </div>

              <form onSubmit={handleLogin} className="p-8 pt-0 space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-2 block ml-1">
                    {tab === 'student' ? 'Admission Number' : 'Admin Username'}
                  </label>
                  <div className="relative">
                    {tab === 'student' ? (
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                    ) : (
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                    )}
                    <input 
                      type="text" 
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={tab === 'student' ? 'WH-101' : 'wedadofficial'}
                      className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-academy-green transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-2 block ml-1">
                    {tab === 'student' ? 'Phone Number' : 'Password'}
                  </label>
                  <div className="relative">
                    {tab === 'student' ? (
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                    ) : (
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                    )}
                    <input 
                      type={tab === 'student' ? 'tel' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={tab === 'student' ? 'Enter Registered Phone' : '••••••••'}
                      className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-academy-green transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-[10px] font-bold text-center bg-red-50 py-2 rounded-lg"
                  >
                    {error}
                  </motion.p>
                )}

                <button 
                  disabled={loading}
                  type="submit"
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 disabled:opacity-50 ${tab === 'admin' ? 'bg-stone-800 text-white hover:bg-black shadow-stone-900/10' : 'bg-academy-green text-white hover:bg-emerald-900 shadow-emerald-900/10'}`}
                >
                  {loading ? 'Verifying...' : `Continue as ${tab === 'student' ? 'Student' : 'Admin'}`}
                </button>

                {tab === 'student' && (
                  <div className="pt-2 text-center">
                    <button 
                      type="button"
                      onClick={() => setTab('admin')}
                      className="text-[10px] uppercase font-black tracking-widest text-stone-400 hover:text-academy-green transition-colors"
                    >
                      Are you an Admin? Click here
                    </button>
                  </div>
                )}
              </form>

              <div className="bg-stone-50 p-6 text-center">
                <p className="text-[10px] uppercase font-bold text-stone-300 tracking-[0.2em]">© Official Portal of Wedad Batch</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
