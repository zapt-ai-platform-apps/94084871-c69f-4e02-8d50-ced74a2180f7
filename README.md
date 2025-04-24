# EditifyAI - Advanced Photo & Video Editing

EditifyAI is a powerful AI-powered mobile application that provides advanced photo and video editing tools with an intuitive interface.

## Features

- **AI-enhanced filters** and one-tap retouching
- **Background remover and replacer** for both photos and videos
- **Object eraser, skin smoothing, and face reshaping**
- **Video editing** tools including trimming, transitions, text overlays, and music syncing
- **AI-generated effects** like motion blur, cinemagraphs, and color grading
- **High-resolution export** for all social media platforms
- **User-friendly interface** with drag-and-drop editing and real-time previews

## Tech Stack

- React with Vite
- TensorFlow.js for client-side AI processing
- Fabric.js for image manipulation
- FFmpeg.wasm for video processing
- Tailwind CSS for styling
- React Router for navigation
- Framer Motion for animations
- Zustand for state management

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve
```

## Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/              # Application pages
│   ├── Home/           # Landing page
│   ├── Editor/         # Main editing interface
│   └── Gallery/        # Project gallery
├── store/              # Zustand state management
└── utils/              # Utility functions
```

## License

All rights reserved.