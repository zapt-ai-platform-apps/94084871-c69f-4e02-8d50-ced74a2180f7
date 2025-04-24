import React from 'react';
import { motion } from 'framer-motion';
import useEditorStore from '@/store/editorStore';

const LoadingOverlay = () => {
  const { processingProgress } = useEditorStore();
  
  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center p-6 rounded-lg max-w-md">
        <div className="w-20 h-20 mx-auto mb-4 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <h3 className="text-white text-xl font-semibold mb-2">
          AI Processing
        </h3>
        <p className="text-white/80 mb-4">
          Hang tight while our AI works its magic...
        </p>
        
        <div className="w-full bg-white/20 rounded-full h-2.5 mb-2">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${processingProgress}%` }}
          ></div>
        </div>
        
        <p className="text-white/60 text-sm">
          {processingProgress}% complete
        </p>
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;