import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Star, Trash2, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  is_featured: boolean;
  is_removed: boolean;
  boost_expires_at: string | null;
  sellers: { name: string };
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const adminEmail = localStorage.getItem('makola_admin_email');
    if (!adminEmail) {
      navigate('/admin/login');
      return;
    }
    
    loadProducts();
  }, [navigate]);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          sellers(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      setProducts(prev => prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
      ));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const boostProduct = async (id: string) => {
    const boostExpiry = new Date();
    boostExpiry.setDate(boostExpiry.getDate() + 7);
    
    await updateProduct(id, {
      boost_expires_at: boostExpiry.toISOString()
    });
  };

  const filteredProducts = products.filter(product =>
    !product.is_removed && (
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase()) ||
      product.sellers?.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" onClick={() => navigate('/admin')} className="mr-4">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-green-600">Manage Products</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Products ({products.filter(p => !p.is_removed).length})</CardTitle>
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>{product.sellers?.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>₵{product.price}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {product.is_featured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                        {product.boost_expires_at && new Date(product.boost_expires_at) > new Date() && (
                          <Badge variant="secondary">Boosted</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={product.is_featured ? 'destructive' : 'default'}
                          onClick={() => updateProduct(product.id, { is_featured: !product.is_featured })}
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => boostProduct(product.id)}
                        >
                          <TrendingUp className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateProduct(product.id, { is_removed: true })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProducts;