import React from 'react';
import useEditorStore from '@/store/editorStore';
import RangeSlider from '../components/RangeSlider';

const AdjustPanel = () => {
  const { files, currentFileId, updateEditData } = useEditorStore();
  
  const currentFile = files.find(file => file.id === currentFileId);
  if (!currentFile) return null;
  
  const { editData } = currentFile;
  
  const handleAdjustChange = (property, value) => {
    updateEditData(currentFileId, (prevEditData) => ({
      ...prevEditData,
      filters: {
        ...prevEditData.filters,
        [property]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Adjustments</h3>
      
      <div className="space-y-4">
        <RangeSlider 
          label="Brightness"
          value={editData.filters.brightness}
          min={-100}
          max={100}
          onChange={(value) => handleAdjustChange('brightness', value)}
        />
        
        <RangeSlider 
          label="Contrast"
          value={editData.filters.contrast}
          min={-100}
          max={100}
          onChange={(value) => handleAdjustChange('contrast', value)}
        />
        
        <RangeSlider 
          label="Saturation"
          value={editData.filters.saturation}
          min={-100}
          max={100}
          onChange={(value) => handleAdjustChange('saturation', value)}
        />
        
        <RangeSlider 
          label="Sharpness"
          value={editData.filters.sharpness || 0}
          min={0}
          max={100}
          onChange={(value) => handleAdjustChange('sharpness', value)}
        />
        
        <RangeSlider 
          label="Blur"
          value={editData.filters.blur || 0}
          min={0}
          max={10}
          step={0.5}
          onChange={(value) => handleAdjustChange('blur', value)}
        />
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            updateEditData(currentFileId, (prevEditData) => ({
              ...prevEditData,
              filters: {
                brightness: 0,
                contrast: 0,
                saturation: 0,
                sharpness: 0,
                blur: 0
              }
            }));
          }}
          className="btn btn-secondary w-full cursor-pointer"
        >
          Reset Adjustments
        </button>
      </div>
    </div>
  );
};

export default AdjustPanel;