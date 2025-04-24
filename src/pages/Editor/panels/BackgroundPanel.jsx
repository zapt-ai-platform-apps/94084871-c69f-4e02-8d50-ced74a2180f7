import React, { useState } from 'react';
import useEditorStore from '@/store/editorStore';

const backgroundOptions = [
  { id: 'remove', name: 'Remove Background', icon: '⊝' },
  { id: 'blur', name: 'Background Blur', icon: '◎' },
  { id: 'replace', name: 'Replace Background', icon: '⟴' }
];

const backgroundPresets = [
  { id: 'gradient1', name: 'Gradient 1', preview: 'linear-gradient(to right, #6366f1, #ec4899)' },
  { id: 'gradient2', name: 'Gradient 2', preview: 'linear-gradient(to right, #8b5cf6, #3b82f6)' },
  { id: 'solid1', name: 'Blue', preview: '#3b82f6' },
  { id: 'solid2', name: 'Green', preview: '#10b981' },
  { id: 'solid3', name: 'Red', preview: '#ef4444' },
  { id: 'solid4', name: 'Yellow', preview: '#f59e0b' },
];

const BackgroundPanel = () => {
  const { files, currentFileId, updateEditData, setAiProcessing, updateAiProgress } = useEditorStore();
  const [activeOption, setActiveOption] = useState(null);
  const [processingBackground, setProcessingBackground] = useState(false);
  
  const currentFile = files.find(file => file.id === currentFileId);
  if (!currentFile) return null;
  
  const handleBackgroundAction = async (option) => {
    setActiveOption(option);
    setProcessingBackground(true);
    setAiProcessing(true, 0);
    
    // Simulate AI processing
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      updateAiProgress(i);
    }
    
    // Update the background setting
    updateEditData(currentFileId, (prevEditData) => ({
      ...prevEditData,
      background: {
        ...(prevEditData.background || {}),
        mode: option
      }
    }));
    
    setAiProcessing(false);
    setProcessingBackground(false);
  };
  
  const handleSelectBackground = (presetId) => {
    if (processingBackground) return;
    
    updateEditData(currentFileId, (prevEditData) => ({
      ...prevEditData,
      background: {
        ...(prevEditData.background || {}),
        preset: presetId
      }
    }));
  };
  
  const handleUploadBackground = () => {
    // In a real implementation, this would open a file picker
    alert('This would open a file picker to select a custom background image.');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Background Editor</h3>
      
      <div className="space-y-3">
        {backgroundOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleBackgroundAction(option.id)}
            disabled={processingBackground}
            className={`w-full flex items-center p-3 rounded-lg border transition-all cursor-pointer ${
              activeOption === option.id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            <div className="text-xl mr-3">{option.icon}</div>
            <span className="font-medium">{option.name}</span>
            
            {processingBackground && activeOption === option.id && (
              <div className="ml-auto w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>
        ))}
      </div>
      
      {activeOption === 'replace' && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium mb-3">Select Background</h4>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {backgroundPresets.map((preset) => (
              <div 
                key={preset.id}
                onClick={() => handleSelectBackground(preset.id)}
                className="aspect-square rounded-md cursor-pointer overflow-hidden border-2 border-transparent hover:border-indigo-500"
                style={{ background: preset.preview }}
              ></div>
            ))}
          </div>
          
          <button 
            onClick={handleUploadBackground}
            className="btn btn-secondary w-full cursor-pointer"
          >
            Upload Custom Background
          </button>
        </div>
      )}
      
      <div className="pt-4 text-sm text-gray-600">
        <p className="mb-2">Our AI technology can:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Automatically detect and isolate subjects</li>
          <li>Remove backgrounds without manual masking</li>
          <li>Work with both people and objects</li>
        </ul>
      </div>
    </div>
  );
};

export default BackgroundPanel;