import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import useEditorStore from '@/store/editorStore';
import { v4 as uuidv4 } from 'uuid';

const fontOptions = [
  { id: 'sans', name: 'Sans-serif' },
  { id: 'serif', name: 'Serif' },
  { id: 'mono', name: 'Monospace' },
  { id: 'display', name: 'Display' },
  { id: 'handwritten', name: 'Handwritten' }
];

const TextPanel = () => {
  const { files, currentFileId, updateEditData } = useEditorStore();
  const [text, setText] = useState('');
  const [selectedFont, setSelectedFont] = useState('sans');
  const [textColor, setTextColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const currentFile = files.find(file => file.id === currentFileId);
  if (!currentFile) return null;
  
  const { editData } = currentFile;
  const textLayers = editData.text || [];
  
  const handleAddText = () => {
    if (!text.trim()) return;
    
    updateEditData(currentFileId, (prevEditData) => ({
      ...prevEditData,
      text: [
        ...(prevEditData.text || []),
        {
          id: uuidv4(),
          content: text,
          font: selectedFont,
          color: textColor,
          size: 24,
          position: { x: 50, y: 50 } // Center of canvas as percentage
        }
      ]
    }));
    
    setText('');
  };
  
  const handleRemoveText = (id) => {
    updateEditData(currentFileId, (prevEditData) => ({
      ...prevEditData,
      text: prevEditData.text.filter(layer => layer.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Text Overlay</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter Text
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Your text here..."
            className="input"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Style
          </label>
          <select 
            value={selectedFont} 
            onChange={(e) => setSelectedFont(e.target.value)}
            className="input"
          >
            {fontOptions.map(font => (
              <option key={font.id} value={font.id}>{font.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text Color
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full flex items-center justify-between input cursor-pointer"
            >
              <span>{textColor}</span>
              <div 
                className="w-6 h-6 rounded-md border border-gray-300" 
                style={{ backgroundColor: textColor }}
              ></div>
            </button>
            
            {showColorPicker && (
              <div className="absolute z-10 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200">
                <HexColorPicker color={textColor} onChange={setTextColor} />
              </div>
            )}
          </div>
        </div>
        
        <button 
          onClick={handleAddText}
          disabled={!text.trim()}
          className="btn btn-primary w-full cursor-pointer"
        >
          Add Text
        </button>
      </div>
      
      {textLayers.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium mb-2">Text Layers</h4>
          
          <div className="space-y-2">
            {textLayers.map((layer) => (
              <div 
                key={layer.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: layer.color }}
                  ></div>
                  <span className="text-sm truncate max-w-[150px]">
                    {layer.content}
                  </span>
                </div>
                <button 
                  onClick={() => handleRemoveText(layer.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="pt-4 text-sm text-gray-600">
        <p>Drag text layers on the canvas to position them.</p>
      </div>
    </div>
  );
};

export default TextPanel;