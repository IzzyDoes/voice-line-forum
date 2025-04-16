
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { userApi } from '@/api';

const UserSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateUsername = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      await userApi.updateProfile(username);
      toast.success('Username updated successfully');
    } catch (error) {
      console.error('Error updating username:', error);
      toast.error('Failed to update username. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    logout();
  };

  if (!user) return null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Update your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>
        
        <div className="space-y-1">
          <Label className="text-muted-foreground">Email</Label>
          <div className="text-sm p-2 bg-muted rounded">
            {user.email}
            <span className="ml-2 text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
              Primary
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
        <Button onClick={handleUpdateUsername} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserSettings;
