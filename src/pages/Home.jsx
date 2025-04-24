import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MdAutoFixHigh, 
  MdFilterNone, 
  MdContentCut, 
  MdLandscape, 
  MdFace, 
  MdMovie, 
  MdUpload 
} from 'react-icons/md';

const features = [
  {
    icon: <MdAutoFixHigh className="h-8 w-8 text-indigo-500" />,
    title: 'AI-Enhanced Filters',
    description: 'One-tap retouching and AI-powered filters that make your content pop.'
  },
  {
    icon: <MdLandscape className="h-8 w-8 text-indigo-500" />,
    title: 'Background Editor',
    description: 'Remove and replace backgrounds in your photos and videos instantly.'
  },
  {
    icon: <MdFilterNone className="h-8 w-8 text-indigo-500" />,
    title: 'Object Eraser',
    description: 'Magically remove unwanted objects from your images with AI precision.'
  },
  {
    icon: <MdFace className="h-8 w-8 text-indigo-500" />,
    title: 'Face Reshaping',
    description: 'Smooth skin, reshape faces, and perfect your portraits effortlessly.'
  },
  {
    icon: <MdContentCut className="h-8 w-8 text-indigo-500" />,
    title: 'Video Editing',
    description: 'Trim videos, add transitions, overlay text, and sync with music.'
  },
  {
    icon: <MdMovie className="h-8 w-8 text-indigo-500" />,
    title: 'AI Effects',
    description: 'Add motion blur, create cinemagraphs, and apply professional color grading.'
  }
];

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center"
    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
    transition={{ duration: 0.2 }}
  >
    <div className="bg-indigo-50 p-3 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/editor');
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-10 md:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EditifyAI
            </span>
          </motion.h1>
          <motion.p 
            className="max-w-2xl mx-auto text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Professional photo and video editing powered by AI. Create stunning content with just a few taps.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button 
              onClick={handleGetStarted}
              className="btn btn-primary py-3 px-8 text-base cursor-pointer"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate('/gallery')}
              className="btn btn-secondary py-3 px-8 text-base cursor-pointer"
            >
              View Gallery
            </button>
          </motion.div>
          
          <motion.div 
            className="relative rounded-xl overflow-hidden max-w-5xl mx-auto shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <img 
              src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512" 
              data-image-request="photo editing app interface with editing tools and a sample portrait photo" 
              alt="EditifyAI Interface Example" 
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.h2 
          className="text-3xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Powerful Features at Your Fingertips
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl py-12 px-6 sm:px-12 text-center text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Create Amazing Content?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Transform your photos and videos with professional-quality edits. No design skills needed.
          </p>
          <button 
            onClick={handleGetStarted} 
            className="btn bg-white text-indigo-600 hover:bg-gray-100 py-3 px-8 text-base font-medium cursor-pointer"
          >
            <MdUpload className="mr-2 h-5 w-5" />
            Start Editing Now
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;