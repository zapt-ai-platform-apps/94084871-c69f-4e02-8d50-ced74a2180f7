import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useEditorStore = create((set, get) => ({
  // File Management
  files: [],
  currentFileId: null,
  isLoading: false,
  
  // Editor State
  activeTab: 'adjust', // adjust, filters, effects, text, stickers, crop
  history: {}, // Stores edit history by fileId
  
  // AI Processing state
  aiProcessing: false,
  processingProgress: 0,
  
  // Actions
  setFiles: (files) => set({ files }),
  
  addFile: (file) => {
    const id = uuidv4();
    const newFile = {
      id,
      file,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      preview: URL.createObjectURL(file),
      name: file.name,
      edited: false,
      createdAt: new Date().toISOString(),
      editData: {
        filters: { brightness: 0, contrast: 0, saturation: 0, blur: 0 },
        crop: null,
        background: null,
        objects: [],
        text: [],
        effects: []
      }
    };
    
    set(state => ({ 
      files: [...state.files, newFile],
      currentFileId: id,
      history: { ...state.history, [id]: [{ editData: newFile.editData, timestamp: Date.now() }] }
    }));
    
    return id;
  },
  
  setCurrentFile: (id) => set({ currentFileId: id }),
  
  removeFile: (id) => {
    set(state => {
      const fileToRemove = state.files.find(file => file.id === id);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      
      const newFiles = state.files.filter(file => file.id !== id);
      const newHistory = { ...state.history };
      delete newHistory[id];
      
      return { 
        files: newFiles,
        currentFileId: newFiles.length > 0 ? newFiles[0].id : null,
        history: newHistory
      };
    });
  },
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  updateEditData: (fileId, updateFn) => {
    set(state => {
      const files = state.files.map(file => {
        if (file.id === fileId) {
          const updatedEditData = updateFn(file.editData);
          
          // Add to history
          const fileHistory = state.history[fileId] || [];
          const newHistoryEntry = {
            editData: updatedEditData,
            timestamp: Date.now()
          };
          
          return {
            ...file,
            edited: true,
            editData: updatedEditData
          };
        }
        return file;
      });
      
      // Update history
      return {
        files,
        history: {
          ...state.history,
          [fileId]: [
            ...(state.history[fileId] || []),
            {
              editData: files.find(f => f.id === fileId).editData,
              timestamp: Date.now()
            }
          ].slice(-20) // Keep last 20 history entries
        }
      };
    });
  },
  
  undo: (fileId) => {
    const history = get().history[fileId];
    if (!history || history.length <= 1) return;
    
    const previousState = history[history.length - 2];
    
    set(state => {
      const files = state.files.map(file => {
        if (file.id === fileId) {
          return {
            ...file,
            editData: previousState.editData
          };
        }
        return file;
      });
      
      return {
        files,
        history: {
          ...state.history,
          [fileId]: history.slice(0, -1)
        }
      };
    });
  },
  
  setAiProcessing: (processing, progress = 0) => set({
    aiProcessing: processing,
    processingProgress: progress
  }),
  
  updateAiProgress: (progress) => set({ processingProgress: progress }),
  
  resetEditor: () => set({
    files: [],
    currentFileId: null,
    activeTab: 'adjust',
    history: {},
    aiProcessing: false,
    processingProgress: 0
  })
}));

export default useEditorStore;