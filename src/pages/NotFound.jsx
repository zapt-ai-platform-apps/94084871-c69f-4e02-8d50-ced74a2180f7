import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdHome } from 'react-icons/md';

const NotFound = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-9xl font-bold text-indigo-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4 mb-6">Page Not Found</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link 
          to="/"
          className="btn btn-primary inline-flex items-center cursor-pointer"
        >
          <MdHome className="mr-2" />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;