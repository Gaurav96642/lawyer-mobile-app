
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ConsultationCardProps {
  id: string;
  lawyerName: string;
  lawyerAvatar: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'canceled';
  topic: string;
  onClick: () => void;
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({
  id,
  lawyerName,
  lawyerAvatar,
  date,
  time,
  status,
  topic,
  onClick
}) => {
  const initials = lawyerName.split(' ').map(n => n[0]).join('');
  
  const getStatusDetails = () => {
    switch(status) {
      case 'upcoming':
        return { color: 'bg-blue-100 text-blue-800 hover:bg-blue-200', text: 'Upcoming' };
      case 'completed':
        return { color: 'bg-green-100 text-green-800 hover:bg-green-200', text: 'Completed' };
      case 'canceled':
        return { color: 'bg-red-100 text-red-800 hover:bg-red-200', text: 'Canceled' };
      default:
        return { color: '', text: '' };
    }
  };

  const statusDetails = getStatusDetails();

  return (
    <Card 
      className="mb-4 cursor-pointer border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={lawyerAvatar} alt={lawyerName} />
              <AvatarFallback className="bg-legal-primary text-white">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">{lawyerName}</h3>
              <p className="text-xs text-gray-500">{topic}</p>
            </div>
          </div>
          <Badge className={statusDetails.color}>
            {statusDetails.text}
          </Badge>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{time}</span>
          </div>
          <div className="font-medium">
            ID: {id}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultationCard;
