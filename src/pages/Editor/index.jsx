import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import useEditorStore from '@/store/editorStore';
import Toolbar from './components/Toolbar';
import EditorCanvas from './components/EditorCanvas';
import AdjustPanel from './panels/AdjustPanel';
import FiltersPanel from './panels/FiltersPanel';
import EffectsPanel from './panels/EffectsPanel';
import TextPanel from './panels/TextPanel';
import BackgroundPanel from './panels/BackgroundPanel';
import CropPanel from './panels/CropPanel';
import LoadingOverlay from './components/LoadingOverlay';
import EmptyEditor from './components/EmptyEditor';
import { MdCloudUpload, MdClose } from 'react-icons/md';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const Editor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  
  const { 
    files, 
    currentFileId, 
    activeTab, 
    setActiveTab, 
    addFile, 
    setCurrentFile,
    aiProcessing 
  } = useEditorStore();
  
  // Set up file from URL parameter or show empty state
  useEffect(() => {
    if (id && files.length > 0) {
      const fileExists = files.some(file => file.id === id);
      if (fileExists) {
        setCurrentFile(id);
      } else {
        navigate('/editor');
      }
    }
  }, [id, files, setCurrentFile, navigate]);
  
  const currentFile = files.find(file => file.id === currentFileId);
  
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Unsupported file type. Please upload an image or video file.');
      return;
    }
    
    // Clear any existing errors
    setError(null);
    
    // Add the file to our store
    const fileId = addFile(file);
    navigate(`/editor/${fileId}`);
  }, [addFile, navigate]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/*': [],
      'video/*': []
    }
  });
  
  const renderActivePanel = () => {
    if (!currentFile) return null;
    
    switch (activeTab) {
      case 'adjust':
        return <AdjustPanel />;
      case 'filters':
        return <FiltersPanel />;
      case 'effects':
        return <EffectsPanel />;
      case 'text':
        return <TextPanel />;
      case 'background':
        return <BackgroundPanel />;
      case 'crop':
        return <CropPanel />;
      default:
        return <AdjustPanel />;
    }
  };
  
  const handleExport = async () => {
    if (!currentFile || !canvasRef.current) return;
    
    try {
      // For images, export as is
      if (currentFile.type === 'image') {
        const dataUrl = canvasRef.current.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `editify-${currentFile.name.split('.')[0]}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } 
      // For videos, more complex export would be needed
      else {
        // This would require ffmpeg.wasm implementation
        console.log('Video export would go here');
        alert('Video export feature coming soon!');
      }
    } catch (error) {
      console.error('Export failed:', error);
      setError('Failed to export. Please try again.');
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-gray-100">
      {!currentFile ? (
        <EmptyEditor onDrop={onDrop} getInputProps={getInputProps} isDragActive={isDragActive} />
      ) : (
        <>
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900">
                  Editing: {currentFile.name}
                </h1>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleExport}
                    className="btn btn-primary cursor-pointer"
                    disabled={aiProcessing}
                  >
                    Export
                  </button>
                </div>
              </div>
              
              <div className="flex-1 flex items-center justify-center p-4 overflow-auto relative">
                <EditorCanvas 
                  file={currentFile} 
                  ref={canvasRef}
                />
                
                {/* File drop overlay */}
                {isDragActive && (
                  <div 
                    className="absolute inset-0 bg-indigo-600 bg-opacity-90 flex flex-col items-center justify-center text-white z-10"
                    {...getRootProps()}
                  >
                    <MdCloudUpload className="w-16 h-16 mb-4" />
                    <p className="text-xl font-medium">Drop your file here</p>
                    <input {...getInputProps()} />
                  </div>
                )}
                
                {aiProcessing && <LoadingOverlay />}
              </div>
              
              {/* Mobile toolbar */}
              <div className="md:hidden border-t border-gray-200 bg-white">
                <Toolbar activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>
            </div>
            
            {/* Side Panel - hidden on mobile, shown as bottom panel */}
            <div className="hidden md:flex md:w-80 lg:w-96 border-l border-gray-200 bg-white flex-col overflow-hidden">
              {/* Toolbar - visible on desktop */}
              <div className="hidden md:block border-b border-gray-200">
                <Toolbar activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>
              
              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {renderActivePanel()}
              </div>
            </div>
          </div>
          
          {/* Mobile Panel - slides up from bottom */}
          <motion.div 
            className="md:hidden fixed inset-x-0 bottom-0 bg-white rounded-t-xl shadow-lg z-20"
            initial={{ y: '100%' }}
            animate={{ y: activeTab ? '0' : '100%' }}
            transition={{ type: 'spring', damping: 30 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="font-medium capitalize">
                {activeTab}
              </h3>
              <button 
                onClick={() => setActiveTab(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {renderActivePanel()}
            </div>
          </motion.div>
        </>
      )}
      
      {/* Error notification */}
      {error && (
        <div className="fixed bottom-4 inset-x-0 mx-auto w-full max-w-md px-4">
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-4 text-white"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;