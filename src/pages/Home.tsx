
import React from 'react';
import { FileText, Briefcase, MessageCircle, Video, Shield, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import LegalService from '@/components/LegalService';
import LawyerCard from '@/components/LawyerCard';

const services = [
  {
    icon: <FileText size={24} />,
    title: 'Document Review',
    description: 'Get your legal documents reviewed by experts',
    color: 'bg-blue-50'
  },
  {
    icon: <MessageCircle size={24} />,
    title: 'Chat Consultation',
    description: 'Text-based consultation with a lawyer',
    color: 'bg-green-50'
  },
  {
    icon: <Video size={24} />,
    title: 'Video Consultation',
    description: 'Face-to-face video call with a legal expert',
    color: 'bg-purple-50'
  },
  {
    icon: <Briefcase size={24} />,
    title: 'Case Management',
    description: 'Track and manage your ongoing legal cases',
    color: 'bg-amber-50'
  },
  {
    icon: <FileSearch size={24} />,
    title: 'Contract Analysis',
    description: 'Detailed analysis of contractual agreements',
    color: 'bg-pink-50'
  },
  {
    icon: <Shield size={24} />,
    title: 'Legal Protection',
    description: 'Ongoing legal protection services',
    color: 'bg-teal-50'
  }
];

const featuredLawyers = [
  {
    name: 'Sarah Johnson',
    avatar: '/placeholder.svg',
    specialty: 'Family Law',
    rating: 4.9,
    experience: 12,
    available: true
  },
  {
    name: 'Michael Chen',
    avatar: '/placeholder.svg',
    specialty: 'Corporate Law',
    rating: 4.8,
    experience: 8,
    available: false
  }
];

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen pb-16">
      <Header title="Legal Advice" />
      
      <main className="flex-1 px-4 pt-4 pb-16 overflow-auto">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Hello, User</h2>
          <p className="text-gray-500">How can we help you today?</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex space-x-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <Button className="whitespace-nowrap bg-legal-primary hover:bg-legal-primary/90">
            <Video size={16} className="mr-2" />
            Book Consultation
          </Button>
          <Button variant="outline" className="whitespace-nowrap">
            <FileText size={16} className="mr-2" />
            Upload Document
          </Button>
          <Button variant="outline" className="whitespace-nowrap">
            <MessageCircle size={16} className="mr-2" />
            Quick Chat
          </Button>
        </div>
        
        {/* Services Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Our Services</h2>
            <Button variant="link" size="sm" className="text-legal-primary">
              View all
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {services.map((service, index) => (
              <LegalService
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                color={service.color}
                onClick={() => console.log(`Selected service: ${service.title}`)}
              />
            ))}
          </div>
        </div>
        
        {/* Featured Lawyers */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Featured Lawyers</h2>
            <Button variant="link" size="sm" className="text-legal-primary">
              View all
            </Button>
          </div>
          <div>
            {featuredLawyers.map((lawyer, index) => (
              <LawyerCard
                key={index}
                name={lawyer.name}
                avatar={lawyer.avatar}
                specialty={lawyer.specialty}
                rating={lawyer.rating}
                experience={lawyer.experience}
                available={lawyer.available}
                onClick={() => console.log(`Selected lawyer: ${lawyer.name}`)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
