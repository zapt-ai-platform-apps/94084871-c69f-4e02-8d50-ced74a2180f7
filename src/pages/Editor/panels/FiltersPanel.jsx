import React, { useState } from 'react';
import useEditorStore from '@/store/editorStore';

const filterPresets = [
  { id: 'original', name: 'Original', values: null },
  { 
    id: 'vibrant', 
    name: 'Vibrant', 
    values: { brightness: 5, contrast: 20, saturation: 30 } 
  },
  { 
    id: 'warm', 
    name: 'Warm', 
    values: { brightness: 10, contrast: 5, saturation: 15, warmth: 20 } 
  },
  { 
    id: 'cool', 
    name: 'Cool', 
    values: { brightness: 5, contrast: 10, saturation: -5, warmth: -20 } 
  },
  { 
    id: 'bw', 
    name: 'B&W', 
    values: { brightness: 5, contrast: 20, saturation: -100 } 
  },
  { 
    id: 'vintage', 
    name: 'Vintage', 
    values: { brightness: -5, contrast: 10, saturation: -20, vignette: 30 } 
  },
  { 
    id: 'dramatic', 
    name: 'Dramatic', 
    values: { brightness: -5, contrast: 35, saturation: 10, vignette: 40 } 
  },
  { 
    id: 'fade', 
    name: 'Fade', 
    values: { brightness: 10, contrast: -10, saturation: -20 } 
  }
];

const FiltersPanel = () => {
  const { files, currentFileId, updateEditData } = useEditorStore();
  const [selectedFilter, setSelectedFilter] = useState('original');
  
  const currentFile = files.find(file => file.id === currentFileId);
  if (!currentFile) return null;
  
  const applyFilter = (filterId) => {
    setSelectedFilter(filterId);
    
    const filter = filterPresets.find(f => f.id === filterId);
    if (!filter) return;
    
    if (filter.id === 'original') {
      // Reset to default values
      updateEditData(currentFileId, (prevEditData) => ({
        ...prevEditData,
        filters: {
          brightness: 0,
          contrast: 0,
          saturation: 0,
          blur: 0
        }
      }));
    } else {
      // Apply the filter preset
      updateEditData(currentFileId, (prevEditData) => ({
        ...prevEditData,
        filters: {
          ...prevEditData.filters,
          ...filter.values
        }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Filters</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filterPresets.map((filter) => (
          <div 
            key={filter.id}
            onClick={() => applyFilter(filter.id)}
            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
              selectedFilter === filter.id 
                ? 'border-indigo-500 shadow-md' 
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              {/* In a real app, this would show a preview of the filter */}
              <div className={`text-2xl ${filter.id === 'original' ? 'opacity-40' : ''}`}>
                {filter.id === 'bw' ? '◐' : '●'}
              </div>
            </div>
            <div className="py-2 text-center text-sm">
              {filter.name}
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 text-sm text-gray-600">
        <p>Filters apply a combination of adjustments for a consistent look.</p>
      </div>
      
      {/* AI Filters section - would be implemented with TensorFlow.js */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="font-medium mb-2 flex items-center">
          <span className="mr-2">AI Filters</span>
          <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-full">
            Beta
          </span>
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="btn btn-secondary cursor-pointer">
            Smart Retouch
          </button>
          <button className="btn btn-secondary cursor-pointer">
            AI Enhance
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;