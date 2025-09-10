import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  MessageCircle, 
  MapPin, 
  Star, 
  Shield, 
  TrendingUp, 
  Receipt, 
  Flag,
  ArrowLeft,
  Clock
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  condition: string;
  location: string;
  seller_id: string;
  is_boosted: boolean;
  views: number;
  whatsapp_clicks: number;
  sellers?: {
    name: string;
    whatsapp_number: string;
    is_verified: boolean;
    location: string;
    response_time: string;
  };
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (id) {
      fetchProduct();
      trackEvent('product_view', { product_id: id });
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data: productData, error } = await supabase
        .from('products')
        .select(`
          *,
          sellers(name, whatsapp_number, is_verified, location, response_time)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      setProduct(productData);

      // Fetch similar products
      const { data: similarData } = await supabase
        .from('products')
        .select('*')
        .eq('category', productData.category)
        .neq('id', id)
        .limit(4);

      setSimilarProducts(similarData || []);

      // Update view count
      await supabase
        .from('products')
        .update({ views: (productData.views || 0) + 1 })
        .eq('id', id);

    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (!product?.sellers) return;

    const message = `Hi! I'm interested in your "${product.title}" listed on Makola Online for GHS ${product.price}. Is it still available?`;
    const whatsappUrl = `https://wa.me/${product.sellers.whatsapp_number}?text=${encodeURIComponent(message)}`;
    
    // Track WhatsApp click
    trackEvent('whatsapp_click', { 
      product_id: product.id,
      seller_id: product.seller_id 
    });

    // Update click count
    supabase
      .from('products')
      .update({ whatsapp_clicks: (product.whatsapp_clicks || 0) + 1 })
      .eq('id', product.id);

    window.open(whatsappUrl, '_blank');
  };

  const handleRequestReceipt = () => {
    trackEvent('receipt_request', { product_id: product?.id });
    // TODO: Implement receipt request functionality
  };

  const handleReportListing = () => {
    trackEvent('report_listing', { product_id: product?.id });
    // TODO: Implement report functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.is_boosted && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Boosted
                  </Badge>
                )}
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant="outline">{product.condition}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              <div className="flex items-center gap-4 text-gray-600 mt-2">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {product.location}
                </span>
                <span>{product.views || 0} views</span>
              </div>
            </div>

            <div className="text-4xl font-bold text-emerald-600">
              GHS {product.price.toLocaleString()}
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Seller Info */}
            {product.sellers && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{product.sellers.name}</h3>
                        {product.sellers.is_verified && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-4 mt-1">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {product.sellers.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {product.sellers.response_time || 'Usually responds quickly'}
                        </span>
                      </div>
                    </div>
                    <Link to={`/seller/${product.seller_id}`}>
                      <Button variant="outline" size="sm">
                        View Store
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleWhatsAppClick}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat on WhatsApp
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleRequestReceipt}
                  className="flex-1"
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Request Receipt
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReportListing}
                  className="flex-1"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report Listing
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <Link to={`/product/${item.id}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                      <div className="text-lg font-bold text-emerald-600">
                        GHS {item.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.location}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;