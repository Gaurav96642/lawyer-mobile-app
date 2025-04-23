
import React from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConsultationCard from '@/components/ConsultationCard';

const consultations = [
  {
    id: 'CON-2401',
    lawyerName: 'Sarah Johnson',
    lawyerAvatar: '/placeholder.svg',
    date: 'Apr 20, 2025',
    time: '10:00 AM',
    status: 'upcoming' as const,
    topic: 'Family Law Consultation'
  },
  {
    id: 'CON-2389',
    lawyerName: 'Michael Chen',
    lawyerAvatar: '/placeholder.svg',
    date: 'Apr 15, 2025',
    time: '2:30 PM',
    status: 'completed' as const,
    topic: 'Contract Review'
  },
  {
    id: 'CON-2376',
    lawyerName: 'Emma Wilson',
    lawyerAvatar: '/placeholder.svg',
    date: 'Apr 10, 2025',
    time: '11:00 AM',
    status: 'canceled' as const,
    topic: 'Intellectual Property Advice'
  },
  {
    id: 'CON-2412',
    lawyerName: 'David Rodriguez',
    lawyerAvatar: '/placeholder.svg',
    date: 'Apr 25, 2025',
    time: '3:15 PM',
    status: 'upcoming' as const,
    topic: 'Criminal Defense Consultation'
  }
];

const Consultations: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen pb-16">
      <Header title="Consultations" />
      
      <main className="flex-1 px-4 pt-4 pb-16 overflow-auto">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {consultations.map((consultation, index) => (
              <ConsultationCard
                key={index}
                id={consultation.id}
                lawyerName={consultation.lawyerName}
                lawyerAvatar={consultation.lawyerAvatar}
                date={consultation.date}
                time={consultation.time}
                status={consultation.status}
                topic={consultation.topic}
                onClick={() => console.log(`Viewing consultation: ${consultation.id}`)}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-0">
            {consultations
              .filter(c => c.status === 'upcoming')
              .map((consultation, index) => (
                <ConsultationCard
                  key={index}
                  id={consultation.id}
                  lawyerName={consultation.lawyerName}
                  lawyerAvatar={consultation.lawyerAvatar}
                  date={consultation.date}
                  time={consultation.time}
                  status={consultation.status}
                  topic={consultation.topic}
                  onClick={() => console.log(`Viewing consultation: ${consultation.id}`)}
                />
              ))}
          </TabsContent>
          
          <TabsContent value="past" className="mt-0">
            {consultations
              .filter(c => c.status === 'completed' || c.status === 'canceled')
              .map((consultation, index) => (
                <ConsultationCard
                  key={index}
                  id={consultation.id}
                  lawyerName={consultation.lawyerName}
                  lawyerAvatar={consultation.lawyerAvatar}
                  date={consultation.date}
                  time={consultation.time}
                  status={consultation.status}
                  topic={consultation.topic}
                  onClick={() => console.log(`Viewing consultation: ${consultation.id}`)}
                />
              ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Consultations;
