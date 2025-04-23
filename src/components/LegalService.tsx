
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LegalServiceProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
  onClick?: () => void;
}

const LegalService: React.FC<LegalServiceProps> = ({ 
  icon, 
  title, 
  description, 
  color = 'bg-legal-light', 
  onClick 
}) => {
  return (
    <Card 
      className={cn("border-none shadow-sm cursor-pointer transition-transform hover:scale-105", color)} 
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="text-legal-primary mb-1">
            {icon}
          </div>
          <h3 className="font-medium text-sm">{title}</h3>
          <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LegalService;
