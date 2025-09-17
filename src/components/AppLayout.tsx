import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from './Header';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import ProductGrid from './ProductGrid';
import LiveSection from './LiveSection';
import FloatingWhatsApp from './FloatingWhatsApp';
import Footer from './Footer';
import { SoftLaunchBanner } from './SoftLaunchBanner';
import { MaintenanceMode } from './MaintenanceMode';
import { supabase } from '@/lib/supabase';
import config from '@/config/environment';
import { useNavigate } from 'react-router-dom';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          sellers (
            business_name,
            phone_number,
            location,
            is_verified
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProducts = data?.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || '/placeholder.svg',
        seller: product.sellers?.business_name || 'Unknown Seller',
        location: product.sellers?.location || 'Unknown Location',
        rating: 4.5,
        isBoosted: product.is_boosted,
        isVerified: product.sellers?.is_verified,
        sellerId: product.seller_id,
        deliveryAvailable: product.delivery_available
      })) || [];

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([
        {
          id: '1',
          name: 'Fresh Tomatoes (1kg)',
          price: 8,
          image: '/placeholder.svg',
          seller: 'Mama Ama',
          location: 'Makola Market',
          rating: 4.8,
          isBoosted: true,
          isVerified: true,
          sellerId: '1',
          deliveryAvailable: false
        },
        {
          id: '2',
          name: 'Samsung Galaxy Phone Case',
          price: 25,
          image: '/placeholder.svg',
          seller: 'Tech Hub Ghana',
          location: 'Accra Central',
          rating: 4.6,
          isBoosted: false,
          isVerified: true,
          sellerId: '2',
          deliveryAvailable: true
        }
      ]);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleVoiceSearch = () => {
    console.log('Voice search activated');
  };

  const handleImageSearch = (file: File) => {
    console.log('Image search with file:', file.name);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'food' && product.name.toLowerCase().includes('tomato')) ||
      (selectedCategory === 'electronics' && product.name.toLowerCase().includes('phone')) ||
      (selectedCategory === 'fashion' && product.name.toLowerCase().includes('kente'));
    
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (config.maintenanceMode) {
    return <MaintenanceMode />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={toggleSidebar} />
      <SoftLaunchBanner />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Ghana&apos;s Premier Online Marketplace
              </h1>
              <p className="text-xl mb-8 text-emerald-100">
                Buy and sell anything, anywhere in Ghana. Connect with verified sellers and get fast delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/sell')}
                  className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
                >
                  Start Selling 🛍️
                </button>
                <button 
                  onClick={() => navigate('/rider/register')}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
                >
                  Become a Rider 🚴
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <img 
                  src="/placeholder.svg" 
                  alt="Everything Market Ghana Marketplace"
                  className="w-full h-96 object-cover rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-800 font-medium">1,247+ Active Sellers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            onVoiceSearch={handleVoiceSearch}
            onImageSearch={handleImageSearch}
          />
        </div>

        <div className="mb-8">
          <LiveSection />
        </div>

        <div className="mb-6">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Products</h2>
            <p className="text-gray-600">
              {filteredProducts.length} items found
            </p>
          </div>
          <ProductGrid products={filteredProducts} loading={loading} />
        </div>
      </main>
      
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
};

export default AppLayout;
