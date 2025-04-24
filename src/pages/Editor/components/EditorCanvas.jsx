import React, { useRef, useEffect, forwardRef, useState } from 'react';
import useEditorStore from '@/store/editorStore';

const EditorCanvas = forwardRef(({ file }, ref) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  
  // Setup canvas size based on container and media dimensions
  useEffect(() => {
    if (!file || !containerRef.current) return;
    
    const updateSize = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const padding = 32; // padding around the canvas
      
      const maxWidth = containerWidth - padding * 2;
      const maxHeight = containerHeight - padding * 2;
      
      let mediaWidth = dimensions.width || 1920; // default if not set yet
      let mediaHeight = dimensions.height || 1080;
      
      // Scale to fit the container
      let scale = Math.min(maxWidth / mediaWidth, maxHeight / mediaHeight);
      
      // Set canvas size
      if (ref.current) {
        ref.current.width = mediaWidth * scale;
        ref.current.height = mediaHeight * scale;
      }
    };
    
    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [file, dimensions, ref]);
  
  // Handle image/video loading
  useEffect(() => {
    if (!file) return;
    
    const loadMedia = () => {
      if (file.type === 'image') {
        const img = new Image();
        img.onload = () => {
          setDimensions({ width: img.width, height: img.height });
          imageRef.current = img;
          drawCanvas();
        };
        img.src = file.preview;
      } else if (file.type === 'video') {
        const video = document.createElement('video');
        video.onloadedmetadata = () => {
          setDimensions({ width: video.videoWidth, height: video.videoHeight });
          videoRef.current = video;
          video.currentTime = 1; // Seek to get a frame
        };
        video.oncanplay = () => {
          drawCanvas();
        };
        video.src = file.preview;
        video.load();
      }
    };
    
    loadMedia();
  }, [file]);
  
  // Draw content to canvas
  const drawCanvas = () => {
    if (!ref.current) return;
    
    const ctx = ref.current.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, ref.current.width, ref.current.height);
    
    // Draw media
    if (file.type === 'image' && imageRef.current) {
      ctx.drawImage(
        imageRef.current, 
        0, 0, 
        ref.current.width, 
        ref.current.height
      );
    } else if (file.type === 'video' && videoRef.current) {
      ctx.drawImage(
        videoRef.current, 
        0, 0, 
        ref.current.width, 
        ref.current.height
      );
    }
    
    // Apply filters and effects based on file.editData
    applyEdits(ctx);
  };
  
  // Apply edits from the file's editData
  const applyEdits = (ctx) => {
    if (!file.editData || !ctx) return;
    
    const { filters } = file.editData;
    
    // Apply basic filters
    if (filters) {
      // Apply brightness, contrast, saturation, etc.
      const filterString = [
        filters.brightness !== 0 ? `brightness(${100 + filters.brightness}%)` : '',
        filters.contrast !== 0 ? `contrast(${100 + filters.contrast}%)` : '',
        filters.saturation !== 0 ? `saturate(${100 + filters.saturation}%)` : '',
        filters.blur !== 0 ? `blur(${filters.blur}px)` : '',
      ].filter(Boolean).join(' ');
      
      if (filterString) {
        ctx.filter = filterString;
        // Redraw with filter
        if (file.type === 'image' && imageRef.current) {
          ctx.drawImage(
            imageRef.current, 
            0, 0, 
            ref.current.width, 
            ref.current.height
          );
        } else if (file.type === 'video' && videoRef.current) {
          ctx.drawImage(
            videoRef.current, 
            0, 0, 
            ref.current.width, 
            ref.current.height
          );
        }
        ctx.filter = 'none'; // Reset filter
      }
    }
    
    // Additional edit types would be applied here
    // For background removal, text overlays, etc.
  };
  
  // Update canvas when editData changes
  useEffect(() => {
    if (ref.current && (imageRef.current || videoRef.current)) {
      drawCanvas();
    }
  }, [file.editData]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex items-center justify-center overflow-hidden"
    >
      <canvas
        ref={ref}
        className="max-w-full max-h-full shadow-lg"
      />
    </div>
  );
});

EditorCanvas.displayName = 'EditorCanvas';

export default EditorCanvas;