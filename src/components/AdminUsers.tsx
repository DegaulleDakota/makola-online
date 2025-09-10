import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Admin {
  email: string;
  role: string;
  created_at: string;
}

const AdminUsers = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('admin');
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const currentAdminEmail = localStorage.getItem('makola_admin_email');
  const currentAdminRole = localStorage.getItem('makola_admin_role');
  const isSuperAdmin = currentAdminRole === 'super_admin';

  useEffect(() => {
    if (!currentAdminEmail) {
      navigate('/admin/login');
      return;
    }
    
    loadAdmins();
  }, [navigate, currentAdminEmail]);

  const loadAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Error loading admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async () => {
    if (!newEmail.trim() || !isSuperAdmin) return;

    try {
      const { error } = await supabase
        .from('admins')
        .insert([{ email: newEmail.toLowerCase().trim(), role: newRole }]);

      if (error) throw error;
      
      setNewEmail('');
      setNewRole('admin');
      setDialogOpen(false);
      loadAdmins();
    } catch (error) {
      console.error('Error adding admin:', error);
    }
  };

  const removeAdmin = async (email: string) => {
    if (!isSuperAdmin || email === 'dukesnr@yahoo.co.uk') return;

    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('email', email);

      if (error) throw error;
      loadAdmins();
    } catch (error) {
      console.error('Error removing admin:', error);
    }
  };

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
            <h1 className="text-2xl font-bold text-green-600">Admin Users</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Admin Users ({admins.length})</CardTitle>
              {isSuperAdmin && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Admin</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="admin@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <select
                          id="role"
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </div>
                      <Button onClick={addAdmin} className="w-full">
                        Add Admin
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.email}>
                    <TableCell className="font-medium">{admin.email}</TableCell>
                    <TableCell>
                      <Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'}>
                        {admin.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(admin.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {isSuperAdmin && admin.email !== 'dukesnr@yahoo.co.uk' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeAdmin(admin.email)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      {admin.email === 'dukesnr@yahoo.co.uk' && (
                        <Badge variant="outline">Protected</Badge>
                      )}
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

export default AdminUsers;