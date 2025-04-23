
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, UserCircle, MessageSquare, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobilePlatform } from '@/hooks/useMobilePlatform';
import { useAuth } from '@/contexts/AuthContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isIOS, isAndroid, isNative } = useMobilePlatform();
  const { user, isLawyer } = useAuth();
  
  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      { path: '/', label: 'Home', icon: Home },
    ];
    
    if (!user) {
      // Not logged in
      return [
        ...baseItems,
        { path: '/lawyers', label: 'Lawyers', icon: Users },
        { path: '/login', label: 'Login', icon: UserCircle },
      ];
    }
    
    const authItems = [
      { path: '/lawyers', label: 'Lawyers', icon: Users },
      { path: '/messages', label: 'Messages', icon: MessageSquare },
      { path: isLawyer ? '/lawyer-dashboard' : '/client-dashboard', label: 'Dashboard', icon: UserCircle },
    ];
    
    // Add consultations for both user types
    if (isLawyer) {
      // Lawyer-specific nav items
      return [
        ...baseItems,
        ...authItems,
        { path: '/availability', label: 'Availability', icon: Calendar },
      ];
    } else {
      // Client-specific nav items
      return [
        ...baseItems,
        ...authItems,
        { path: '/consultations', label: 'Consultations', icon: Video },
      ];
    }
  };
  
  const navItems = getNavItems();

  return (
    <nav className={cn(
      "fixed bottom-0 w-full bg-white border-t border-gray-200 py-2 px-4 flex justify-around",
      isIOS && "pb-safe-bottom",
      isAndroid && "pb-2",
      isNative && "shadow-lg"
    )}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={cn(
              "flex flex-col items-center py-2 px-4 rounded-lg transition-colors w-1/5",
              isActive ? "text-legal-primary" : "text-gray-500 hover:text-gray-700"
            )}
            style={{
              touchAction: 'manipulation'
            }}
          >
            <item.icon 
              size={24} 
              className={cn(
                "mb-1 transition-colors",
                isActive ? "text-legal-primary" : "text-gray-500"
              )} 
            />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
