import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Member {
  id: string;
  name: string;
  phoneNumber: string;
  category: 'teacher' | 'committee' | 'leader' | 'student';
  photoUrl: string;
  admissionNumber?: string;
}

interface AuthContextType {
  adminUser: { username: string } | null;
  memberUser: Member | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  loginMember: (admissionNumber: string, password: string) => Promise<boolean>;
  logoutAll: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<{ username: string } | null>(null);
  const [memberUser, setMemberUser] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check Local Storage for Admin Session
    const savedAdmin = localStorage.getItem('wedad_admin_session');
    if (savedAdmin) {
      setAdminUser(JSON.parse(savedAdmin));
    }

    // Check Local Storage for Member Session
    const savedMember = localStorage.getItem('wedad_member_session');
    if (savedMember) {
      setMemberUser(JSON.parse(savedMember));
    }
    
    setIsLoading(false);
  }, []);

  const loginAdmin = async (username: string, password: string) => {
    if (username === 'wedadofficial' && password === 'admin1234') {
      const user = { username };
      setAdminUser(user);
      localStorage.setItem('wedad_admin_session', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const loginMember = async (admissionNumber: string, phoneNumber: string) => {
    const q = query(
      collection(db, 'members'), 
      where('admissionNumber', '==', admissionNumber),
      where('phoneNumber', '==', phoneNumber)
    );
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const member = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Member;
      setMemberUser(member);
      localStorage.setItem('wedad_member_session', JSON.stringify(member));
      return true;
    }
    return false;
  };

  const logoutAll = () => {
    setAdminUser(null);
    setMemberUser(null);
    localStorage.removeItem('wedad_admin_session');
    localStorage.removeItem('wedad_member_session');
  };

  const isAdmin = 
    (adminUser !== null) || 
    (memberUser?.category === 'teacher' || memberUser?.category === 'committee');

  const isLoggedIn = adminUser !== null || memberUser !== null;

  return (
    <AuthContext.Provider value={{ 
      adminUser, 
      memberUser, 
      isLoggedIn,
      isAdmin, 
      loginAdmin,
      loginMember, 
      logoutAll,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useWedadAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useWedadAuth must be used within AuthProvider');
  return context;
}
