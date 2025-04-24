import React, { useState } from 'react';
import useEditorStore from '@/store/editorStore';

const effects = [
  { id: 'motionBlur', name: 'Motion Blur', icon: '⟿' },
  { id: 'cinemagraph', name: 'Cinemagraph', icon: '⟲' },
  { id: 'tiltShift', name: 'Tilt Shift', icon: '◎' },
  { id: 'glitch', name: 'Glitch', icon: '⚡' },
  { id: 'neon', name: 'Neon Glow', icon: '✧' },
  { id: 'duotone', name: 'Duotone', icon: '◑' },
  { id: 'vignette', name: 'Vignette', icon: '⦿' },
  { id: 'noise', name: 'Film Grain', icon: '⁙' }
];

const EffectsPanel = () => {
  const { files, currentFileId, updateEditData, setAiProcessing, updateAiProgress } = useEditorStore();
  const [processingEffect, setProcessingEffect] = useState(null);
  
  const currentFile = files.find(file => file.id === currentFileId);
  if (!currentFile) return null;
  
  const handleEffectClick = async (effectId) => {
    setProcessingEffect(effectId);
    setAiProcessing(true, 0);
    
    // Simulate AI processing with progress updates
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      updateAiProgress(i);
    }
    
    // Apply the effect after "processing"
    setTimeout(() => {
      updateEditData(currentFileId, (prevEditData) => ({
        ...prevEditData,
        effects: [...(prevEditData.effects || []), { type: effectId, intensity: 50 }]
      }));
      
      setAiProcessing(false);
      setProcessingEffect(null);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Effects</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {effects.map((effect) => (
          <button
            key={effect.id}
            onClick={() => handleEffectClick(effect.id)}
            disabled={processingEffect !== null}
            className={`flex flex-col items-center p-4 rounded-lg border transition-all cursor-pointer ${
              processingEffect === effect.id
                ? 'border-indigo-300 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            <div className="text-2xl mb-2">{effect.icon}</div>
            <span className="text-sm font-medium text-gray-800">{effect.name}</span>
            
            {processingEffect === effect.id && (
              <div className="mt-2 w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>
        ))}
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <h4 className="font-medium mb-4">AI-Generated Effects</h4>
        
        <div className="space-y-3">
          <button 
            className="btn btn-accent w-full cursor-pointer"
            disabled={processingEffect !== null}
          >
            Style Transfer
          </button>
          
          <button 
            className="btn btn-secondary w-full cursor-pointer"
            disabled={processingEffect !== null}
          >
            Generate Cinemagraph
          </button>
        </div>
        
        <p className="mt-4 text-sm text-gray-600">
          AI effects use machine learning to create advanced visual transformations that would be difficult to achieve with traditional filters.
        </p>
      </div>
    </div>
  );
};

export default EffectsPanel;