import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/contexts/AppContext';
import { languages } from '@/lib/languages';
import { setSellerSession } from '@/auth/session';

interface SellerFormData {
  businessName: string;
  phoneNumber: string;
  location: string;
  productName: string;
  category: string;
  price: string;
  description: string;
  deliveryAvailable: boolean;
  deliveryCost: string;
  deliveryAreas: string;
}

const SellerOnboarding: React.FC = () => {
  const { language } = useAppContext();
  const navigate = useNavigate();
  const t = languages[language];

  const [formData, setFormData] = useState<SellerFormData>({
    businessName: '',
    phoneNumber: '',
    location: '',
    productName: '',
    category: '',
    price: '',
    description: '',
    deliveryAvailable: false,
    deliveryCost: '',
    deliveryAreas: ''
  });

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create seller first
      const { data: seller, error: sellerError } = await supabase
        .from('sellers')
        .insert({
          business_name: formData.businessName,
          phone_number: formData.phoneNumber,
          location: formData.location,
          preferred_language: language
        })
        .select()
        .single();

      if (sellerError) throw sellerError;

      // Upload image if provided
      let imageUrl: string | null = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${seller.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (!uploadError) {
          const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
          imageUrl = data.publicUrl;
        }
      }

      // Create product
      const { error: productError } = await supabase
        .from('products')
        .insert({
          name: formData.productName,
          price: parseFloat(formData.price),
          description: formData.description,
          category: formData.category,
          image_url: imageUrl,
          seller_id: seller.id,
          location: formData.location,
          delivery_available: formData.deliveryAvailable,
          delivery_cost: formData.deliveryCost ? parseFloat(formData.deliveryCost) : null,
          delivery_areas: formData.deliveryAreas.split(',').map(area => area.trim())
        });

      if (productError) throw productError;

      // Track successful registration with analytics
      const { trackEvent } = await import('@/hooks/useAnalytics');
      trackEvent('seller_registration', seller.id);

      // Automatically log in the seller and redirect to dashboard
      setSellerSession({
        sellerId: seller.id,
        name: formData.businessName,
        whatsapp: formData.phoneNumber
      });

      alert('Registration successful! Welcome to Everything Market Ghana. You are now logged in and ready to start selling.');

      // Track click-to-registration conversion
      const clickData = JSON.parse(localStorage.getItem('makola_start_selling_clicks') || '[]');
      const conversionData = {
        timestamp: new Date().toISOString(),
        converted: true,
        businessName: formData.businessName
      };
      clickData.push(conversionData);
      localStorage.setItem('makola_start_selling_clicks', JSON.stringify(clickData));

      // Short delay to show welcome message before redirect
      setTimeout(() => {
        navigate('/seller');
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t.registerAsSeller}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="businessName">{t.businessName}</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">{t.phoneNumber}</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="location">{t.location}</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, location: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accra">Accra</SelectItem>
                <SelectItem value="kumasi">Kumasi</SelectItem>
                <SelectItem value="tamale">Tamale</SelectItem>
                <SelectItem value="cape-coast">Cape Coast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="productImage">Product Image</Label>
            <Input
              id="productImage"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <Label htmlFor="productName">{t.productName}</Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">{t.category}</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">{t.food}</SelectItem>
                <SelectItem value="electronics">{t.electronics}</SelectItem>
                <SelectItem value="fashion">{t.fashion}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">{t.price} (GHS)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">{t.description}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="delivery"
              checked={formData.deliveryAvailable}
              onCheckedChange={(checked) => setFormData({ ...formData, deliveryAvailable: checked })}
            />
            <Label htmlFor="delivery">{t.deliveryAvailable}</Label>
          </div>

          {formData.deliveryAvailable && (
            <>
              <div>
                <Label htmlFor="deliveryCost">Delivery Cost (GHS)</Label>
                <Input
                  id="deliveryCost"
                  type="number"
                  step="0.01"
                  value={formData.deliveryCost}
                  onChange={(e) => setFormData({ ...formData, deliveryCost: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="deliveryAreas">Delivery Areas (comma separated)</Label>
                <Input
                  id="deliveryAreas"
                  value={formData.deliveryAreas}
                  onChange={(e) => setFormData({ ...formData, deliveryAreas: e.target.value })}
                  placeholder="Accra, Tema, Kasoa"
                />
              </div>
            </>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t.loading : t.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SellerOnboarding;
