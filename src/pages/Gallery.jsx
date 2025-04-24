import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdEdit, MdDelete, MdShare, MdDownload, MdAdd } from 'react-icons/md';
import useEditorStore from '@/store/editorStore';

const Gallery = () => {
  const navigate = useNavigate();
  const { files, removeFile } = useEditorStore();
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Load files from localStorage on mount
  useEffect(() => {
    const loadFilesFromStorage = () => {
      try {
        const savedFiles = localStorage.getItem('editifyai_files');
        if (savedFiles) {
          // We would need to handle recreating File objects and previews here
          // This is simplified for now
          console.log('Would load saved files', JSON.parse(savedFiles));
        }
      } catch (error) {
        console.error('Failed to load files from storage:', error);
      }
    };
    
    loadFilesFromStorage();
  }, []);
  
  const handleEdit = (fileId) => {
    navigate(`/editor/${fileId}`);
  };
  
  const handleDelete = (fileId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this item?')) {
      removeFile(fileId);
    }
  };
  
  const handleShare = async (fileId, e) => {
    e.stopPropagation();
    try {
      const file = files.find(f => f.id === fileId);
      if (!file) return;
      
      if (navigator.share) {
        await navigator.share({
          title: file.name,
          text: 'Check out my creation with EditifyAI!',
          // This would be the actual file URL in production
          url: file.preview,
        });
      } else {
        // Fallback if Web Share API is not available
        alert('Sharing is not supported in this browser');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const handleDownload = (fileId, e) => {
    e.stopPropagation();
    const file = files.find(f => f.id === fileId);
    if (!file) return;
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = file.preview;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const handleNewCreation = () => {
    navigate('/editor');
  };

  return (
    <div className="h-full overflow-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Gallery</h1>
          <p className="mt-2 text-gray-600">View and manage your edited photos and videos</p>
        </header>
        
        {files.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto"
            >
              <div className="rounded-full bg-indigo-50 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MdAdd className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">
                Start creating amazing photos and videos with our AI-powered editor
              </p>
              <button 
                onClick={handleNewCreation}
                className="btn btn-primary py-2 px-6 cursor-pointer"
              >
                Create New Project
              </button>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Item Card */}
            <motion.div 
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center text-center h-64 cursor-pointer"
              onClick={handleNewCreation}
            >
              <div className="rounded-full bg-indigo-50 p-3 mb-4">
                <MdAdd className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Create New</h3>
              <p className="text-gray-500 text-sm">Start a new project</p>
            </motion.div>
          
            {files.map((file) => (
              <motion.div
                key={file.id}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
                onClick={() => setSelectedFile(file)}
              >
                <div className="relative h-48 bg-gray-100">
                  <img 
                    src={file.preview} 
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  {file.type === 'video' && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      Video
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-gray-900 font-medium truncate">{file.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                  
                  <div className="flex justify-between">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEdit(file.id); }}
                      className="text-indigo-600 hover:text-indigo-800"
                      aria-label="Edit"
                    >
                      <MdEdit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={(e) => handleShare(file.id, e)}
                      className="text-indigo-600 hover:text-indigo-800"
                      aria-label="Share"
                    >
                      <MdShare className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={(e) => handleDownload(file.id, e)}
                      className="text-indigo-600 hover:text-indigo-800"
                      aria-label="Download"
                    >
                      <MdDownload className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(file.id, e)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Delete"
                    >
                      <MdDelete className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* File Preview Modal */}
        {selectedFile && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-xl overflow-hidden relative">
              <button 
                onClick={() => setSelectedFile(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
              >
                <MdClose className="h-6 w-6" />
              </button>
              
              {selectedFile.type === 'image' ? (
                <img 
                  src={selectedFile.preview} 
                  alt={selectedFile.name}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              ) : (
                <video 
                  src={selectedFile.preview}
                  controls
                  className="w-full h-auto max-h-[80vh]"
                />
              )}
              
              <div className="p-4 bg-white flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{selectedFile.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedFile.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={() => handleEdit(selectedFile.id)}
                    className="btn btn-primary cursor-pointer"
                  >
                    <MdEdit className="mr-1 h-4 w-4" />
                    Edit
                  </button>
                  <button 
                    onClick={(e) => handleShare(selectedFile.id, e)}
                    className="btn btn-secondary cursor-pointer"
                  >
                    <MdShare className="mr-1 h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;