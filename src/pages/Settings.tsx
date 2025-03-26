
import React from 'react';
import { Settings as SettingsIcon, Moon, Sun, Type, Accessibility, User } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSettings } from '@/contexts/SettingsContext';
import { useUser } from '@clerk/clerk-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserSettings from '@/components/UserSettings';

const Settings: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    fontSize, 
    setFontSize, 
    textToSpeech, 
    toggleTextToSpeech 
  } = useSettings();
  
  const { user } = useUser();

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

      <Tabs defaultValue="appearance">
        <TabsList className="mb-6">
          <TabsTrigger value="appearance">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance">
          <div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-2 rounded-full bg-primary/10">
                <SettingsIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Appearance Settings</h3>
                <p className="text-sm text-muted-foreground">Configure your experience</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-full bg-muted">
                    {theme === 'dark' ? (
                      <Moon size={18} className="text-indigo-400" />
                    ) : (
                      <Sun size={18} className="text-amber-400" />
                    )}
                  </div>
                  <div>
                    <label htmlFor="theme-toggle" className="text-sm font-medium">
                      {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Adjust the appearance of the interface
                    </p>
                  </div>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>

              {/* Font Size Settings */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-full bg-muted">
                    <Type size={18} />
                  </div>
                  <label className="text-sm font-medium">Font Size</label>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Adjust the text size for better readability
                </p>
                <ToggleGroup 
                  type="single" 
                  value={fontSize} 
                  onValueChange={(value) => value && setFontSize(value as 'small' | 'medium' | 'large')}
                  className="justify-start"
                >
                  <ToggleGroupItem value="small" aria-label="Small text">
                    <span className="text-xs">Small</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="medium" aria-label="Medium text">
                    <span className="text-sm">Medium</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="large" aria-label="Large text">
                    <span className="text-base">Large</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Accessibility - Text to Speech */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-full bg-muted">
                    <Accessibility size={18} />
                  </div>
                  <div>
                    <label htmlFor="text-to-speech-toggle" className="text-sm font-medium">
                      Text to Speech
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Enable speech synthesis for content
                    </p>
                  </div>
                </div>
                <Switch
                  id="text-to-speech-toggle"
                  checked={textToSpeech}
                  onCheckedChange={toggleTextToSpeech}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="account">
          <UserSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
