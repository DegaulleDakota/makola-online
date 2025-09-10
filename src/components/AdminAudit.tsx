import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import { localAdapter } from '../lib/localAdapter';
import { AuditLog } from '../lib/marketplaceAdapter';
import { Search, Activity, User, Settings, CreditCard } from 'lucide-react';

const AdminAudit: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadAuditLogs();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = auditLogs.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.admin_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.subject && log.subject.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredLogs(filtered);
    } else {
      setFilteredLogs(auditLogs);
    }
  }, [searchTerm, auditLogs]);

  const loadAuditLogs = async () => {
    try {
      const data = await localAdapter.adminListAudit();
      setAuditLogs(data);
      setFilteredLogs(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load audit logs",
        variant: "destructive"
      });
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('seller') || action.includes('user')) {
      return <User className="h-4 w-4" />;
    }
    if (action.includes('credit') || action.includes('payment')) {
      return <CreditCard className="h-4 w-4" />;
    }
    if (action.includes('settings')) {
      return <Settings className="h-4 w-4" />;
    }
    return <Activity className="h-4 w-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('delete') || action.includes('ban') || action.includes('suspend')) {
      return 'destructive';
    }
    if (action.includes('verify') || action.includes('feature') || action.includes('add')) {
      return 'default';
    }
    return 'secondary';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatAction = (action: string) => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Log</h1>
        <p className="text-muted-foreground">Track all administrative actions and changes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by action, admin email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <Card key={log.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getActionIcon(log.action)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getActionColor(log.action)}>
                        {formatAction(log.action)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        by {log.admin_email}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(log.at)}
                    </p>
                    {log.subject && (
                      <p className="text-sm mt-1">
                        Subject: <span className="font-mono">{log.subject}</span>
                      </p>
                    )}
                    {log.meta && Object.keys(log.meta).length > 0 && (
                      <details className="mt-2">
                        <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                          View details
                        </summary>
                        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(log.meta, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm ? 'No matching audit logs found' : 'No audit logs yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminAudit;