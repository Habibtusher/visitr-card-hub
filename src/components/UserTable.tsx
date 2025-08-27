import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Mail, Phone, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  website: string;
  phone: string;
  jobTitle: string;
  company: string;
}

export const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Replace with your backend API endpoint
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
      setError(errorMessage);
      toast({
        title: "Error loading users",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleRefresh = () => {
    fetchUsers();
  };

  if (error && !isLoading) {
    return (
      <Card className="p-8 shadow-card bg-gradient-card border-0">
        <div className="text-center space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Error Loading Users</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-card bg-gradient-card border-0">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">User Directory</h2>
            <p className="text-muted-foreground">
              Manage and search through user contacts
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold text-foreground">Name</th>
                <th className="text-left p-4 font-semibold text-foreground">Email</th>
                <th className="text-left p-4 font-semibold text-foreground">Job Title</th>
                <th className="text-left p-4 font-semibold text-foreground">Company</th>
                <th className="text-left p-4 font-semibold text-foreground">Phone</th>
                <th className="text-left p-4 font-semibold text-foreground">Website</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-12 text-muted-foreground">
                    {searchTerm ? 'No users match your search criteria.' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr 
                    key={user.id}
                    className={`border-t border-border hover:bg-muted/30 transition-smooth ${
                      index % 2 === 0 ? 'bg-background/50' : 'bg-muted/20'
                    }`}
                  >
                    <td className="p-4">
                      <div className="font-medium text-foreground">{user.name}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`mailto:${user.email}`}
                          className="text-primary hover:text-primary-glow transition-smooth"
                        >
                          {user.email}
                        </a>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="text-xs">
                        {user.jobTitle}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-foreground">{user.company}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`tel:${user.phone}`}
                          className="text-foreground hover:text-primary transition-smooth"
                        >
                          {user.phone}
                        </a>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.website && (
                        <a
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-primary hover:text-primary-glow transition-smooth"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Visit</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {filteredUsers.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/20">
          <p className="text-sm text-muted-foreground text-center">
            Showing {filteredUsers.length} of {users.length} users
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      )}
    </Card>
  );
};