import { useState, useEffect } from "react";
import { useAuth } from "@/auth/session";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Check, X, Edit, Eye } from "lucide-react";

interface WhatsAppUpload {
  id: string;
  message_text: string;
  images: string[];
  parsed_title: string;
  parsed_price: number;
  parsed_description: string;
  status: 'pending' | 'published' | 'rejected';
  created_at: string;
  product_id?: string;
}

export default function WhatsAppUploadManager() {
  const { seller } = useAuth();
  const [uploads, setUploads] = useState<WhatsAppUpload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (seller?.id) {
      loadUploads();
    }
  }, [seller?.id]);

  const loadUploads = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_uploads')
        .select('*')
        .eq('seller_id', seller?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUploads(data || []);
    } catch (error) {
      console.error('Failed to load uploads:', error);
    } finally {
      setLoading(false);
    }
  };

  const publishUpload = async (uploadId: string) => {
    try {
      const upload = uploads.find(u => u.id === uploadId);
      if (!upload) return;

      // Create product from upload
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          seller_id: seller?.id,
          title: upload.parsed_title,
          price: upload.parsed_price || 0,
          description: upload.parsed_description,
          category: 'General',
          images: upload.images,
          status: 'active'
        })
        .select()
        .single();

      if (productError) throw productError;

      // Update upload status
      const { error: updateError } = await supabase
        .from('whatsapp_uploads')
        .update({ 
          status: 'published',
          product_id: product.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', uploadId);

      if (updateError) throw updateError;

      await loadUploads();
    } catch (error) {
      console.error('Failed to publish upload:', error);
    }
  };

  const rejectUpload = async (uploadId: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_uploads')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', uploadId);

      if (error) throw error;
      await loadUploads();
    } catch (error) {
      console.error('Failed to reject upload:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading WhatsApp uploads...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            WhatsApp Product Uploads
          </CardTitle>
          <CardDescription>
            Manage products uploaded via WhatsApp. Send photos and details to our WhatsApp bot to create drafts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No WhatsApp uploads yet</p>
              <p className="text-sm">Send product photos to our WhatsApp bot to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {uploads.map((upload) => (
                <div key={upload.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium">{upload.parsed_title || 'Untitled'}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {upload.parsed_price ? `GHS ${upload.parsed_price}` : 'No price specified'}
                      </p>
                    </div>
                    <Badge className={getStatusColor(upload.status)}>
                      {upload.status}
                    </Badge>
                  </div>
                  
                  {upload.parsed_description && (
                    <p className="text-sm text-gray-700 mb-3">{upload.parsed_description}</p>
                  )}
                  
                  {upload.images.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {upload.images.slice(0, 3).map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Upload ${idx + 1}`}
                          className="w-16 h-16 rounded object-cover"
                        />
                      ))}
                      {upload.images.length > 3 && (
                        <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                          +{upload.images.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(upload.created_at).toLocaleDateString()}
                    </span>
                    
                    {upload.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectUpload(upload.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => publishUpload(upload.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Publish
                        </Button>
                      </div>
                    )}
                    
                    {upload.status === 'published' && upload.product_id && (
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View Product
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}