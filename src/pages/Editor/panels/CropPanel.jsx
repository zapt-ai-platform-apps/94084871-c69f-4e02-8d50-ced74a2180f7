import React, { useState } from 'react';
import useEditorStore from '@/store/editorStore';

const aspectRatios = [
  { id: 'free', label: 'Free', value: null },
  { id: '1:1', label: '1:1', value: 1 },
  { id: '4:3', label: '4:3', value: 4/3 },
  { id: '16:9', label: '16:9', value: 16/9 },
  { id: '9:16', label: '9:16', value: 9/16 },
  { id: '3:4', label: '3:4', value: 3/4 },
  { id: '3:2', label: '3:2', value: 3/2 },
  { id: '2:3', label: '2:3', value: 2/3 }
];

const CropPanel = () => {
  const { files, currentFileId, updateEditData } = useEditorStore();
  const [selectedRatio, setSelectedRatio] = useState('free');
  
  const currentFile = files.find(file => file.id === currentFileId);
  if (!currentFile) return null;
  
  const handleAspectRatioChange = (ratioId) => {
    setSelectedRatio(ratioId);
    
    const ratio = aspectRatios.find(r => r.id === ratioId);
    if (!ratio) return;
    
    updateEditData(currentFileId, (prevEditData) => ({
      ...prevEditData,
      crop: {
        ...(prevEditData.crop || {}),
        aspectRatio: ratio.value
      }
    }));
  };
  
  const handleRotate = (degrees) => {
    updateEditData(currentFileId, (prevEditData) => ({
      ...prevEditData,
      crop: {
        ...(prevEditData.crop || {}),
        rotation: ((prevEditData.crop?.rotation || 0) + degrees) % 360
      }
    }));
  };
  
  const handleFlip = (direction) => {
    updateEditData(currentFileId, (prevEditData) => ({
      ...prevEditData,
      crop: {
        ...(prevEditData.crop || {}),
        flip: {
          ...(prevEditData.crop?.flip || { horizontal: false, vertical: false }),
          [direction]: !(prevEditData.crop?.flip?.[direction] || false)
        }
      }
    }));
  };
  
  const handleReset = () => {
    updateEditData(currentFileId, (prevEditData) => ({
      ...prevEditData,
      crop: null
    }));
    setSelectedRatio('free');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Crop & Rotate</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-4 gap-2">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => handleAspectRatioChange(ratio.id)}
              className={`py-2 px-3 text-sm rounded-md cursor-pointer ${
                selectedRatio === ratio.id
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {ratio.label}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rotate & Flip
        </label>
        <div className="flex space-x-2 mb-2">
          <button
            onClick={() => handleRotate(-90)}
            className="flex-1 py-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer"
          >
            ↺ 90°
          </button>
          <button
            onClick={() => handleRotate(90)}
            className="flex-1 py-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer"
          >
            ↻ 90°
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleFlip('horizontal')}
            className="flex-1 py-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer"
          >
            ↔ Flip H
          </button>
          <button
            onClick={() => handleFlip('vertical')}
            className="flex-1 py-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer"
          >
            ↕ Flip V
          </button>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleReset}
          className="btn btn-secondary w-full cursor-pointer"
        >
          Reset Crop & Rotation
        </button>
      </div>
      
      <div className="pt-2 text-sm text-gray-600">
        <p>
          Drag the corners of the crop frame on the canvas to adjust the crop area.
        </p>
      </div>
      
      {currentFile.type === 'image' && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium mb-3">AI-Powered Options</h4>
          <div className="space-y-2">
            <button className="btn btn-secondary w-full cursor-pointer">
              Smart Crop
            </button>
            <button className="btn btn-secondary w-full cursor-pointer">
              Auto Straighten
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropPanel;