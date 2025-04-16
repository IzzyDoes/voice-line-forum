
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from "@/lib/utils";
import { Home, Settings, Menu, X, LogIn, UserPlus, LogOut, Shield } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/contexts/SettingsContext';

type NavItem = {
  path: string;
  label: string;
  icon: React.ElementType;
  requiresAuth?: boolean;
  adminOnly?: boolean;
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useSettings();
  
  const navItems: NavItem[] = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/settings', label: 'Settings', icon: Settings, requiresAuth: true },
  ];
  
  // Add admin route if user is admin
  if (isAdmin) {
    navItems.push({ 
      path: '/admin', 
      label: 'Admin Dashboard', 
      icon: Shield, 
      requiresAuth: true,
      adminOnly: true 
    });
  }
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMobile && isOpen && !target.closest('.sidebar') && !target.closest('.sidebar-trigger')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isOpen]);

  // Handle body scroll lock on mobile
  useEffect(() => {
    if (isMobile) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile]);

  return (
    <>
      {/* Mobile Menu Trigger */}
      <button 
        className="sidebar-trigger fixed top-4 left-4 z-50 p-2 rounded-full bg-background shadow-md lg:hidden transition-all duration-200 hover:shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in lg:hidden" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "sidebar fixed lg:sticky top-0 left-0 z-40 h-full w-64 bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
          isMobile ? (
            isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
          ) : "translate-x-0",
          "lg:h-screen lg:flex-shrink-0"
        )}
      >
        <div className="flex flex-col h-full px-3 py-6">
          <div className="px-3 pb-6 mb-6 border-b border-sidebar-border">
            <h1 className="text-xl font-semibold tracking-tight">Political Forum</h1>
            <p className="text-sm text-muted-foreground mt-1">Voice your opinions</p>
          </div>
          
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              // Skip admin-only items for non-admins
              if (item.adminOnly && !isAdmin) return null;
              
              // Skip auth-required items for signed-out users
              if (item.requiresAuth && !isAuthenticated) return null;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
          
          <div className="border-t border-sidebar-border pt-6 mt-6 space-y-3">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center px-3 py-2">
                  <div className="flex-1 mr-2">
                    <p className="text-sm font-medium truncate">{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
                    aria-label="Sign out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <NavLink
                  to="/sign-in"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <LogIn size={18} />
                  <span>Sign In</span>
                </NavLink>
                <NavLink
                  to="/sign-up"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <UserPlus size={18} />
                  <span>Sign Up</span>
                </NavLink>
              </div>
            )}
            
            <div className="rounded-md bg-sidebar-accent px-3 py-4">
              <h3 className="text-sm font-medium">Political Forum</h3>
              <p className="mt-1 text-xs text-sidebar-foreground/80">
                A safe space to voice your political opinions.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
