import { useState, useEffect } from "react";
import { useAuth } from "@/auth/session";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, MessageCircle, TrendingUp, Package, Search, Filter, Plus, Trash2, Edit } from "lucide-react";
import BoostButton from "./BoostButton";
import WhatsAppUploadManager from "./WhatsAppUploadManager";

export default function MyProductsPage() {
  const { seller } = useAuth();
  const { dataSource } = useAppContext();
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    loadProducts();
  }, [seller?.id]);

  const loadProducts = async () => {
    if (!seller?.id) return;
    try {
      setLoading(true);
      const sellerProducts = await dataSource.listSellerProducts(seller.id);
      setProducts(sellerProducts);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(products.map(p => p.category))];
  const statuses = [...new Set(products.map(p => p.status))];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const bulkAction = async (action: 'hide' | 'delete' | 'boost') => {
    if (selectedProducts.length === 0) return;
    
    try {
      // Implement bulk actions here
      console.log(`Performing ${action} on products:`, selectedProducts);
      setSelectedProducts([]);
      await loadProducts();
    } catch (error) {
      console.error(`Failed to ${action} products:`, error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "products"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            My Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "whatsapp"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            WhatsApp Uploads
          </button>
        </nav>
      </div>

      {activeTab === "whatsapp" ? (
        <WhatsAppUploadManager />
      ) : (
        <>
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  My Products
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions */}
              {selectedProducts.length > 0 && (
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg mb-4">
                  <span className="text-sm font-medium">
                    {selectedProducts.length} product(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => bulkAction('hide')}>
                      Hide Selected
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => bulkAction('boost')}>
                      Boost Selected
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => bulkAction('delete')}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete Selected
                    </Button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="text-center py-8">Loading products...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  {products.length === 0 ? (
                    <>
                      <h3 className="text-lg font-medium mb-2">No products yet</h3>
                      <p className="text-gray-500 mb-4">Start selling by adding your first product</p>
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Product
                        </Button>
                        <Button variant="outline">
                          📱 Upload via WhatsApp
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium mb-2">No products match your filters</h3>
                      <p className="text-gray-500">Try adjusting your search or filters</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Select All */}
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Checkbox
                      checked={selectedProducts.length === filteredProducts.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-gray-600">Select all</span>
                  </div>

                  {filteredProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                      />
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{product.title}</h3>
                        <p className="text-sm text-gray-600">GHS {product.price}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {product.views || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {product.whatsappClicks || 0} clicks
                          </span>
                          <Badge variant={product.status === "active" ? "default" : "secondary"}>
                            {product.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <BoostButton productId={product.id} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}