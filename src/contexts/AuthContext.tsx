import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  loginSandbox: (displayName?: string, email?: string, isCreatorUser?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (!userDoc.exists()) {
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              createdAt: serverTimestamp(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
          } else {
            setUser(userDoc.data() as User);
          }
        } catch (dbError) {
          console.warn('Firestore database unreachable or permissions locked, initiating offline core:', dbError);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || 'operator@devflow.local',
            displayName: firebaseUser.displayName || 'Default Operator',
            photoURL: firebaseUser.photoURL,
          });
        }
      } else {
        // Check for local sandbox override session
        const storedSandboxUser = localStorage.getItem('devflow_sandbox_user');
        if (storedSandboxUser) {
          setUser(JSON.parse(storedSandboxUser));
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginSandbox = async (
    displayName = 'Chief Architect Mgcini Shaun',
    email = 'mgcinishaun524@gmail.com',
    isCreatorUser = true
  ) => {
    const sandboxUser: User = {
      uid: 'devflow-sandbox-id-999',
      email,
      displayName,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0f172a&color=06b6d4`,
    };
    
    localStorage.setItem('devflow_sandbox_user', JSON.stringify(sandboxUser));
    if (isCreatorUser) {
      localStorage.setItem('devflow_is_creator', 'true');
    } else {
      localStorage.removeItem('devflow_is_creator');
    }
    setUser(sandboxUser);
  };

  const logout = async () => {
    localStorage.removeItem('devflow_sandbox_user');
    localStorage.removeItem('devflow_is_creator');
    await signOut(auth).catch(() => {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginSandbox, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
