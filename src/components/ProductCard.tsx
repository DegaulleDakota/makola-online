import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MessageCircle, Zap, Receipt } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/contexts/AppContext';
import { languages } from '@/lib/languages';
import VerificationBadge from './VerificationBadge';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  seller: string;
  location: string;
  rating: number;
  isBoosted?: boolean;
  isVerified?: boolean;
  sellerId?: string;
  deliveryAvailable?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language } = useAppContext();
  const t = languages[language];

  const handleWhatsAppClick = async () => {
    // Track buyer inquiry
    try {
      await supabase.functions.invoke('track-buyer-inquiry', {
        body: {
          productId: product.id,
          sellerId: product.sellerId,
          interactionType: 'whatsapp_click'
        }
      });
    } catch (error) {
      console.error('Error tracking inquiry:', error);
    }

    // Open WhatsApp with proper tracking
    const message = encodeURIComponent(
      `Hi, I saw "${product?.name || 'this product'}" on Makola Online. Is it available?`
    );
    const sellerNumber = product?.seller || '233000000000'; // Fallback number
    window.open(`https://wa.me/${sellerNumber}?text=${message}`, '_blank');
  };
  const handleRequestReceipt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-receipt', {
        body: {
          productId: product.id,
          sellerId: product.sellerId,
          buyerPhone: '', // Would get from user context in real app
          amount: product.price
        }
      });

      if (error) throw error;

      // Create downloadable receipt
      const receiptContent = `
MAKOLA MARKETPLACE RECEIPT
Receipt #: ${data.receipt.receiptNumber}
Date: ${new Date(data.receipt.timestamp).toLocaleDateString()}

Product: ${data.receipt.product.name}
Price: GHS ${data.receipt.amount}
Seller: ${data.receipt.seller.businessName}
Location: ${data.receipt.seller.location}

Verification: ${data.receipt.verificationUrl}
      `.trim();

      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${data.receipt.receiptNumber}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Failed to generate receipt');
    }
  };
  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${product?.isBoosted ? 'ring-2 ring-yellow-400' : ''}`}>
      {product?.isBoosted && (
        <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
          <Zap className="w-3 h-3 mr-1" />
          {t.boosted}
        </Badge>
      )}
      
      <div className="aspect-square overflow-hidden">
        <img 
          src={product?.image || '/placeholder.svg'} 
          alt={product?.name || 'Product'}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product?.name || 'Product'}</h3>
        <p className="text-2xl font-bold text-green-600 mb-2">GHS {product?.price || 0}</p>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-600">{product?.seller || 'Unknown Seller'}</span>
          <VerificationBadge isVerified={product?.isVerified || false} />
        </div>
        
        <div className="flex items-center gap-1 mb-3">
          <span className="text-sm text-gray-600">{product?.location || 'Location not specified'}</span>
          {product?.deliveryAvailable && (
            <Badge variant="outline" className="text-xs ml-2">Delivery</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{product?.rating || 0}</span>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {t.chatOnWhatsApp}
          </Button>
          
          <Button
            onClick={handleRequestReceipt}
            variant="outline"
            className="w-full"
          >
            <Receipt className="w-4 h-4 mr-2" />
            {t.requestReceipt}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;