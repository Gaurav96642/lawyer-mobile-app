
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface LawyerCardProps {
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  experience: number;
  available: boolean;
  onClick: () => void;
}

const LawyerCard: React.FC<LawyerCardProps> = ({
  name,
  avatar,
  specialty,
  rating,
  experience,
  available,
  onClick
}) => {
  const initials = name.split(' ').map(n => n[0]).join('');
  
  return (
    <Card className="overflow-hidden animate-fade-in mb-4 border border-gray-100 shadow-sm">
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <Avatar className="h-16 w-16 border-2 border-gray-100">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-legal-primary text-white">{initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{name}</h3>
              {available ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Available</Badge>
              ) : (
                <Badge variant="outline" className="text-gray-500">Busy</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">{specialty}</p>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" />
              <span className="text-xs ml-1 font-medium">{rating.toFixed(1)}</span>
              <span className="text-xs text-gray-500 ml-2">{experience} years experience</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 px-4 py-3 flex justify-between items-center bg-gray-50">
          <div className="text-xs font-medium text-gray-500">
            Next available: Today, 2:00 PM
          </div>
          <Button 
            size="sm" 
            onClick={onClick}
            className="bg-legal-primary hover:bg-legal-primary/90"
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LawyerCard;
