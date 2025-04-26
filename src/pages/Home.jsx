import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MdLocalPharmacy,
  MdShoppingCart,
  MdDescription,
  MdOutlineLocalShipping,
  MdPersonSearch,
  MdSecurity,
  MdSearch,
  MdArrowForward
} from 'react-icons/md';
import { useAuth } from '@/modules/auth/useAuth';
import { db } from '@/firebaseClient';
import { collection, getDocs, limit, query } from 'firebase/firestore';

const features = [
  {
    icon: <MdLocalPharmacy className="h-8 w-8 text-blue-500" />,
    title: 'Wide Range of Medicines',
    description: 'Access to thousands of medicines across different categories.'
  },
  {
    icon: <MdDescription className="h-8 w-8 text-blue-500" />,
    title: 'Prescription Upload',
    description: 'Easily upload your prescription and get the required medicines delivered.'
  },
  {
    icon: <MdOutlineLocalShipping className="h-8 w-8 text-blue-500" />,
    title: 'Fast Delivery',
    description: 'Quick and reliable delivery right to your doorstep.'
  },
  {
    icon: <MdPersonSearch className="h-8 w-8 text-blue-500" />,
    title: 'Expert Consultation',
    description: 'Get advice from healthcare professionals about your medications.'
  },
  {
    icon: <MdShoppingCart className="h-8 w-8 text-blue-500" />,
    title: 'Easy Ordering',
    description: 'Simple and intuitive interface for ordering medicines online.'
  },
  {
    icon: <MdSecurity className="h-8 w-8 text-blue-500" />,
    title: 'Secure Payments',
    description: 'Multiple payment options with secure transaction processing.'
  }
];

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center"
    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
    transition={{ duration: 0.2 }}
  >
    <div className="bg-blue-50 p-3 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const ProductCard = ({ product, onClick }) => (
  <motion.div 
    className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
    onClick={onClick}
  >
    <div className="h-48 overflow-hidden">
      <img 
        src={product.imageUrl || "https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512"} 
        alt={product.name}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-4">
      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
      <div className="flex justify-between items-center">
        <span className="text-blue-700 font-bold">${product.price.toFixed(2)}</span>
        {product.requiresPrescription && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Prescription
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

const CategoryCard = ({ category, onClick }) => (
  <motion.div 
    className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
    onClick={onClick}
  >
    <div className="h-32 overflow-hidden">
      <img 
        src={category.imageUrl || "https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512"}
        alt={category.name}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-4">
      <h3 className="font-medium text-gray-900 text-center">{category.name}</h3>
    </div>
  </motion.div>
);

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        const productsQuery = query(collection(db, 'medicines'), limit(8));
        const productsSnapshot = await getDocs(productsQuery);
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFeaturedProducts(productsData);
        
        // Fetch categories
        const categoriesQuery = query(collection(db, 'categories'));
        const categoriesSnapshot = await getDocs(categoriesQuery);
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  
  const handleCategoryClick = (categoryId) => {
    navigate(`/catalogue/${categoryId}`);
  };
  
  const handleShopNow = () => {
    navigate('/catalogue');
  };
  
  const handleUploadPrescription = () => {
    navigate(isAuthenticated ? '/prescriptions' : '/auth');
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Your Health, Our Priority
              </motion.h1>
              <motion.p 
                className="text-xl mb-8 text-blue-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Get your medications delivered right to your doorstep. Fast, reliable, and secure.
              </motion.p>
              
              <motion.form 
                onSubmit={handleSearch}
                className="relative mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <input
                  type="text"
                  placeholder="Search for medicines..."
                  className="input py-3 pl-4 pr-12 w-full max-w-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
                >
                  <MdSearch className="w-6 h-6" />
                </button>
              </motion.form>
              
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <button 
                  onClick={handleShopNow}
                  className="btn bg-white text-blue-700 hover:bg-blue-50 py-3 px-6 text-base font-medium cursor-pointer"
                >
                  Shop Now
                </button>
                <button 
                  onClick={handleUploadPrescription}
                  className="btn bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-700 py-3 px-6 text-base font-medium cursor-pointer"
                >
                  Upload Prescription
                </button>
              </motion.div>
            </div>
            
            <motion.div 
              className="hidden md:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <img 
                src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512"
                data-image-request="medical store app with medicines and prescription items"
                alt="Medical Store Hero" 
                className="rounded-lg shadow-lg w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
          <button 
            onClick={() => navigate('/catalogue')}
            className="text-blue-700 hover:text-blue-900 font-medium flex items-center"
          >
            View All <MdArrowForward className="ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))
          ) : (
            Array(6).fill().map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm h-48 animate-pulse">
                <div className="h-32 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <button 
            onClick={() => navigate('/catalogue')}
            className="text-blue-700 hover:text-blue-900 font-medium flex items-center"
          >
            View All <MdArrowForward className="ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product.id)}
              />
            ))
          ) : (
            Array(8).fill().map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm h-64 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MedStore?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide a convenient, reliable, and secure platform for all your medical needs.
          </p>
        </div>
        
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
          className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-xl py-12 px-6 sm:px-12 text-center text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Order Your Medicines?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Get started with MedStore today and experience the convenience of doorstep medicine delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleShopNow} 
              className="btn bg-white text-blue-700 hover:bg-blue-50 py-3 px-8 text-base font-medium cursor-pointer"
            >
              <MdShoppingCart className="mr-2 h-5 w-5" />
              Shop Now
            </button>
            <button 
              onClick={handleUploadPrescription} 
              className="btn bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-700 py-3 px-8 text-base font-medium cursor-pointer"
            >
              <MdDescription className="mr-2 h-5 w-5" />
              Upload Prescription
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;