import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/useAuth';
import { motion } from 'framer-motion';
import { MdEmail, MdLock, MdPerson, MdPhone, MdArrowBack } from 'react-icons/md';
import toast from 'react-hot-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneAuth, setPhoneAuth] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loginWithEmail, registerWithEmail, loginWithGoogle, setupPhoneAuth, verifyPhoneCode } = useAuth();
  
  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);
  
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      await registerWithEmail(email, password, name);
      toast.success('Registration successful! Please verify your email.');
      setIsLogin(true);
    } catch (error) {
      toast.error(error.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error.message || 'Failed to login with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePhoneAuth = async (e) => {
    e.preventDefault();
    if (!phone) {
      toast.error('Please enter your phone number');
      return;
    }
    
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      const result = await setupPhoneAuth(formattedPhone);
      setConfirmationResult(result);
      setPhoneAuth(true);
      toast.success('Verification code sent!');
    } catch (error) {
      toast.error(error.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }
    
    setLoading(true);
    try {
      await verifyPhoneCode(confirmationResult, verificationCode);
      toast.success('Phone verified successfully!');
    } catch (error) {
      toast.error(error.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512"
          alt="MedStore Logo"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {phoneAuth ? 'Verify Phone' : isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {phoneAuth ? (
            <form className="space-y-6" onSubmit={handleVerifyCode}>
              <div>
                <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <div className="mt-1 relative">
                  <input
                    id="verification-code"
                    name="verification-code"
                    type="text"
                    autoComplete="one-time-code"
                    required
                    className="input"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-sm text-blue-700 hover:text-blue-500 font-medium"
                  onClick={() => setPhoneAuth(false)}
                >
                  <MdArrowBack className="inline mr-1" /> Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary w-32 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </form>
          ) : isLogin ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <form className="space-y-6" onSubmit={handleEmailLogin}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdEmail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="input pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="input pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <button type="button" className="font-medium text-blue-700 hover:text-blue-500">
                      Forgot your password?
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn btn-primary w-full py-2 cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhoneAuth(true)}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <MdPhone className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button
                  type="button"
                  className="font-medium text-blue-700 hover:text-blue-500"
                  onClick={() => setIsLogin(false)}
                >
                  Don't have an account? Sign up
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <form className="space-y-6" onSubmit={handleRegister}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdPerson className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="input pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdEmail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="register-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="input pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="register-password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="input pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number (optional)
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className="input pl-10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn btn-primary w-full py-2 cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Create account'}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  className="font-medium text-blue-700 hover:text-blue-500"
                  onClick={() => setIsLogin(true)}
                >
                  Already have an account? Sign in
                </button>
              </div>
            </motion.div>
          )}
          
          {/* reCAPTCHA container for phone auth */}
          {phoneAuth && (
            <div id="recaptcha-container" className="mt-6"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;