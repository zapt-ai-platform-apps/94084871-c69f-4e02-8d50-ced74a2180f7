import React from 'react';
import { motion } from 'framer-motion';
import { MdCloudUpload, MdImage, MdVideoCameraBack } from 'react-icons/md';

const EmptyEditor = ({ onDrop, getInputProps, isDragActive }) => {
  return (
    <div className="h-full p-4 sm:p-8 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white rounded-xl shadow-sm p-6 sm:p-10 text-center"
        {...onDrop}
      >
        <div className={`border-2 border-dashed rounded-xl p-8 sm:p-12 transition-all ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
        }`}>
          <input {...getInputProps()} />
          
          <div className="flex justify-center">
            <div className="rounded-full bg-indigo-100 p-4">
              <MdCloudUpload className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            {isDragActive ? 'Drop your file here' : 'Upload a file to get started'}
          </h2>
          
          <p className="mt-2 text-gray-600 max-w-xs mx-auto">
            Drag and drop or click to select a photo or video to start editing
          </p>
          
          <div className="mt-8 flex justify-center">
            <button className="btn btn-primary cursor-pointer">
              Select File
            </button>
          </div>
        </div>
      </motion.div>
      
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <MdImage className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Photo Editing
          </h3>
          <p className="mt-2 text-gray-600">
            Enhance images with AI filters, remove backgrounds, erase objects, and more
          </p>
        </div>
        
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
            <MdVideoCameraBack className="h-8 w-8 text-pink-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Video Editing
          </h3>
          <p className="mt-2 text-gray-600">
            Trim videos, add transitions, overlay text, and apply professional effects
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyEditor;