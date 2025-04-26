import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MdHome, 
  MdShoppingCart, 
  MdLocalPharmacy, 
  MdLogin,
  MdMenu, 
  MdClose, 
  MdPerson,
  MdList,
  MdLogout,
  MdAdminPanelSettings,
  MdReceipt,
  MdSearch
} from 'react-icons/md';
import { useAuth } from '@/modules/auth/useAuth';
import { useCartStore } from '@/modules/cart/cartStore';

const MainLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { items } = useCartStore();
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const navItems = [
    { icon: <MdHome className="w-5 h-5" />, text: 'Home', path: '/' },
    { icon: <MdLocalPharmacy className="w-5 h-5" />, text: 'Medicines', path: '/catalogue' },
  ];
  
  const userNavItems = isAuthenticated ? [
    { icon: <MdPerson className="w-5 h-5" />, text: 'Profile', path: '/profile' },
    { icon: <MdList className="w-5 h-5" />, text: 'Orders', path: '/orders' },
    { icon: <MdReceipt className="w-5 h-5" />, text: 'Prescriptions', path: '/prescriptions' },
  ] : [];
  
  // Add admin link if user is admin
  if (isAdmin) {
    userNavItems.push({ 
      icon: <MdAdminPanelSettings className="w-5 h-5" />, 
      text: 'Admin Dashboard', 
      path: '/admin' 
    });
  }
  
  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };
  
  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="h-full flex flex-col">
      {/* Mobile Header Bar */}
      <header className="bg-white shadow-sm py-3 px-4 flex items-center justify-between md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=32&height=32" 
            alt="MedStore Logo" 
            className="w-8 h-8" 
          />
          <span className="text-lg font-semibold text-blue-700">
            MedStore
          </span>
        </Link>
        
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-1">
            <MdShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          <button 
            onClick={toggleMenu} 
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <MdClose className="w-6 h-6" /> : <MdMenu className="w-6 h-6" />}
          </button>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          className="fixed inset-0 z-50 bg-white pt-16 px-4 md:hidden overflow-y-auto"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search medicines..."
                className="input pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-700"
              >
                <MdSearch className="w-5 h-5" />
              </button>
            </form>
          </div>
          
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.text}</span>
                </Link>
              </li>
            ))}
            
            <li>
              <Link
                to="/cart"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  location.pathname === '/cart'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <MdShoppingCart className="w-5 h-5" />
                <span className="font-medium">Cart</span>
                {cartItemCount > 0 && (
                  <span className="ml-auto bg-blue-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </li>
            
            {userNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.text}</span>
                </Link>
              </li>
            ))}
            
            {isAuthenticated ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <MdLogout className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/auth"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MdLogin className="w-5 h-5" />
                  <span className="font-medium">Login / Register</span>
                </Link>
              </li>
            )}
          </ul>
          
          {isAuthenticated && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.displayName || 'User'}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Desktop Header */}
      <header className="hidden md:block bg-white shadow-sm py-4 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=32&height=32" 
                alt="MedStore Logo" 
                className="w-8 h-8" 
              />
              <span className="text-lg font-semibold text-blue-700">
                MedStore
              </span>
            </Link>
            
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 font-medium ${
                    location.pathname === item.path
                      ? 'text-blue-700'
                      : 'text-gray-600 hover:text-blue-700'
                  }`}
                >
                  {item.icon}
                  <span>{item.text}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative w-64">
              <input
                type="text"
                placeholder="Search medicines..."
                className="input pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-700"
              >
                <MdSearch className="w-5 h-5" />
              </button>
            </form>
            
            <Link
              to="/cart"
              className="relative p-1 hover:text-blue-700"
              aria-label="Shopping cart"
            >
              <MdShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-700 hover:text-blue-700">
                  <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <span className="font-medium">
                    {user?.displayName || 'Account'}
                  </span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="font-medium text-gray-900 truncate">{user?.displayName || 'User'}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                  </div>
                  
                  <div className="py-1">
                    {userNavItems.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item.icon}
                        <span>{item.text}</span>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="py-1 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <MdLogout className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn btn-primary"
              >
                <MdLogin className="mr-2 h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">MedStore</h3>
            <p className="text-gray-400 text-sm">
              Your trusted partner for all medical needs. We deliver quality medicines right to your doorstep.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/catalogue" className="hover:text-white">Medicines</Link></li>
              <li><Link to="/prescriptions" className="hover:text-white">Upload Prescription</Link></li>
              <li><Link to="/orders" className="hover:text-white">Track Order</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#faq" className="hover:text-white">FAQs</a></li>
              <li><a href="#shipping" className="hover:text-white">Shipping Policy</a></li>
              <li><a href="#returns" className="hover:text-white">Return Policy</a></li>
              <li><a href="#privacy" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="text-gray-400 text-sm not-italic">
              <p>1234 Health Avenue</p>
              <p>Wellness City, WC 56789</p>
              <p className="mt-2">Email: support@medstore.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} MedStore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;