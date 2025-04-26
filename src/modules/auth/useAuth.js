import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';
import { auth } from '@/firebaseClient';
import * as Sentry from '@sentry/browser';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  const registerWithEmail = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      await sendEmailVerification(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      Sentry.captureException(error);
      throw error;
    }
  };
  
  const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      Sentry.captureException(error);
      throw error;
    }
  };
  
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return userCredential.user;
    } catch (error) {
      console.error('Google login error:', error);
      Sentry.captureException(error);
      throw error;
    }
  };
  
  const setupPhoneAuth = (phoneNumber) => {
    // This needs to be called in a click handler
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',
      callback: () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
    
    return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  };
  
  const verifyPhoneCode = async (confirmationResult, code) => {
    try {
      const userCredential = await confirmationResult.confirm(code);
      return userCredential.user;
    } catch (error) {
      console.error('Phone verification error:', error);
      Sentry.captureException(error);
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      Sentry.captureException(error);
      throw error;
    }
  };
  
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      Sentry.captureException(error);
      throw error;
    }
  };
  
  return {
    ...context,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    setupPhoneAuth,
    verifyPhoneCode,
    logout,
    resetPassword
  };
};