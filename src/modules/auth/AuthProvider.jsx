import React, { createContext, useState, useEffect } from 'react';
import { auth } from '@/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { recordLogin } from '@/supabaseClient';
import * as Sentry from '@sentry/browser';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState({ isAdmin: false });
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasRecordedLogin, setHasRecordedLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get user custom claims (roles)
          const idTokenResult = await firebaseUser.getIdTokenResult();
          
          setUser(firebaseUser);
          setUserRoles({
            isAdmin: !!idTokenResult.claims.admin
          });
          
          // Record the login for analytics
          if (!hasRecordedLogin && firebaseUser.email) {
            try {
              await recordLogin(firebaseUser.email, import.meta.env.VITE_PUBLIC_APP_ENV);
              setHasRecordedLogin(true);
            } catch (error) {
              console.error('Failed to record login:', error);
              Sentry.captureException(error);
            }
          }
        } else {
          setUser(null);
          setUserRoles({ isAdmin: false });
          setHasRecordedLogin(false);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        Sentry.captureException(error);
      } finally {
        setIsInitializing(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [hasRecordedLogin]);

  const value = {
    user,
    isAdmin: userRoles.isAdmin,
    isAuthenticated: !!user,
    isInitializing
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};