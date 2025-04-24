import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MdHome, 
  MdPhotoLibrary, 
  MdEdit, 
  MdMenu, 
  MdClose, 
  MdFeedback 
} from 'react-icons/md';

const MainLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { icon: <MdHome className="w-5 h-5" />, text: 'Home', path: '/' },
    { icon: <MdEdit className="w-5 h-5" />, text: 'Editor', path: '/editor' },
    { icon: <MdPhotoLibrary className="w-5 h-5" />, text: 'Gallery', path: '/gallery' }
  ];
  
  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="h-full flex flex-col">
      {/* Mobile Header Bar */}
      <header className="bg-white shadow-sm py-3 px-4 flex items-center justify-between md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=32&height=32" 
            alt="EditifyAI Logo" 
            className="w-8 h-8" 
          />
          <span className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            EditifyAI
          </span>
        </Link>
        
        <button 
          onClick={toggleMenu} 
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <MdClose className="w-6 h-6" /> : <MdMenu className="w-6 h-6" />}
        </button>
      </header>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          className="fixed inset-0 z-50 bg-white pt-16 px-4 md:hidden"
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.3 }}
        >
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    location.pathname === item.path
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-6">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=32&height=32" 
                  alt="EditifyAI Logo" 
                  className="w-8 h-8" 
                />
                <span className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  EditifyAI
                </span>
              </Link>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg ${
                    location.pathname === item.path
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.text}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <a
              href="mailto:support@editifyai.com"
              className="flex-shrink-0 w-full group flex items-center px-2 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <MdFeedback className="mr-3 h-5 w-5 text-gray-500" />
              <span>Send Feedback</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-64">
        <main className="h-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;