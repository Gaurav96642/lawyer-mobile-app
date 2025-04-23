
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Settings, 
  CreditCard, 
  Bell, 
  Shield, 
  HelpCircle,
  ChevronRight, 
  FileText
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  {
    icon: <User size={20} />,
    label: 'Personal Information',
    action: () => console.log('Navigate to personal info')
  },
  {
    icon: <CreditCard size={20} />,
    label: 'Payment Methods',
    action: () => console.log('Navigate to payment methods')
  },
  {
    icon: <FileText size={20} />,
    label: 'Documents',
    action: () => console.log('Navigate to documents'),
    count: 3
  },
  {
    icon: <Bell size={20} />,
    label: 'Notifications',
    action: () => console.log('Navigate to notifications')
  },
  {
    icon: <Shield size={20} />,
    label: 'Privacy & Security',
    action: () => console.log('Navigate to privacy')
  },
  {
    icon: <HelpCircle size={20} />,
    label: 'Help & Support',
    action: () => console.log('Navigate to help')
  },
  {
    icon: <Settings size={20} />,
    label: 'Settings',
    action: () => console.log('Navigate to settings')
  }
];

const Profile: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen pb-16">
      <Header title="Profile" />
      
      <main className="flex-1 px-4 pt-4 pb-16 overflow-auto">
        {/* User Info Card */}
        <Card className="mb-6 border-none bg-legal-primary text-white shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Avatar className="h-16 w-16 border-2 border-white/50">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-white text-legal-primary">JD</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">Jane Doe</h2>
                <p className="text-sm text-white/80">jane.doe@example.com</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-white/30 text-white hover:bg-white hover:text-legal-primary"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Membership Status */}
        <Card className="mb-6 border border-gray-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Free Plan</h3>
                <p className="text-sm text-gray-500">Limited access to services</p>
              </div>
              <Button className="bg-legal-primary hover:bg-legal-primary/90">Upgrade</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Menu Items */}
        <Card className="border border-gray-100">
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <button 
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  onClick={item.action}
                >
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center">
                    {item.count && (
                      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full mr-2">
                        {item.count}
                      </span>
                    )}
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </button>
                {index < menuItems.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </CardContent>
        </Card>
        
        {/* Sign Out Button */}
        <div className="mt-6 text-center">
          <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
