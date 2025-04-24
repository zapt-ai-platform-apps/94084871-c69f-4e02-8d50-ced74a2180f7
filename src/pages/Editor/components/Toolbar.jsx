import React from 'react';
import { 
  MdTune, 
  MdFilterVintage, 
  MdAutoFixHigh, 
  MdTitle, 
  MdLandscape, 
  MdCrop,
  MdUndo,
  MdRedo
} from 'react-icons/md';
import useEditorStore from '@/store/editorStore';

const tabs = [
  { id: 'adjust', icon: <MdTune />, label: 'Adjust' },
  { id: 'filters', icon: <MdFilterVintage />, label: 'Filters' },
  { id: 'effects', icon: <MdAutoFixHigh />, label: 'Effects' },
  { id: 'text', icon: <MdTitle />, label: 'Text' },
  { id: 'background', icon: <MdLandscape />, label: 'Background' },
  { id: 'crop', icon: <MdCrop />, label: 'Crop' },
];

const Toolbar = ({ activeTab, setActiveTab }) => {
  const { currentFileId, undo } = useEditorStore();
  
  const handleTabClick = (tabId) => {
    setActiveTab(activeTab === tabId ? null : tabId);
  };
  
  const handleUndo = () => {
    if (currentFileId) {
      undo(currentFileId);
    }
  };

  return (
    <div className="flex items-center overflow-x-auto hide-scrollbar p-2 gap-1">
      <div className="flex-1 flex items-center justify-start overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg text-sm whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === tab.id 
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="mt-1 text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="flex items-center border-l border-gray-200 pl-2">
        <button
          onClick={handleUndo}
          className="p-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
          title="Undo"
        >
          <MdUndo className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;