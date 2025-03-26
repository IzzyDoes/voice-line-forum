
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Home, Settings, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

type NavItem = {
  path: string;
  label: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
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
            {navItems.map((item) => (
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
            ))}
          </nav>
          
          <div className="border-t border-sidebar-border pt-6 mt-6">
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
