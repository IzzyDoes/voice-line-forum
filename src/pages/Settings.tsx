
import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="container py-8 animate-fade-in max-w-2xl">
      <div className="mb-8">
        <div className="space-y-1 pb-6 border-b">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your preferences and account settings.
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-2 rounded-full bg-primary/10">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium">User Settings</h3>
            <p className="text-sm text-muted-foreground">Configure your experience</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            User settings will be available in future updates. For now, all posts are anonymous and no account is required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
