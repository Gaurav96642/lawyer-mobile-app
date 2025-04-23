
import React, { useState } from 'react';
import Header from '@/components/Header';
import LawyerCard from '@/components/LawyerCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

const lawyers = [
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
  },
  {
    name: 'David Rodriguez',
    avatar: '/placeholder.svg',
    specialty: 'Criminal Defense',
    rating: 4.7,
    experience: 15,
    available: true
  },
  {
    name: 'Emma Wilson',
    avatar: '/placeholder.svg',
    specialty: 'Intellectual Property',
    rating: 4.9,
    experience: 10,
    available: true
  },
  {
    name: 'James Taylor',
    avatar: '/placeholder.svg',
    specialty: 'Real Estate Law',
    rating: 4.6,
    experience: 7,
    available: false
  }
];

const specialties = [
  'All',
  'Family Law', 
  'Corporate Law', 
  'Criminal Defense', 
  'Intellectual Property', 
  'Real Estate Law'
];

const Lawyers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  
  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lawyer.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || lawyer.specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <Header title="Find Lawyers" />
      
      <main className="flex-1 px-4 pt-4 pb-16 overflow-auto">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            className="pl-10 pr-4 py-2 w-full rounded-full border-gray-200" 
            placeholder="Search by name or specialty" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8" 
            aria-label="Filter"
          >
            <Filter size={18} />
          </Button>
        </div>
        
        {/* Specialty Filter */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {specialties.map((specialty) => (
              <Button 
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                className={`whitespace-nowrap ${selectedSpecialty === specialty ? 'bg-legal-primary hover:bg-legal-primary/90' : ''}`}
                onClick={() => setSelectedSpecialty(specialty)}
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Lawyers List */}
        <div>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="available">Available Now</TabsTrigger>
              <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {filteredLawyers.length > 0 ? (
                filteredLawyers.map((lawyer, index) => (
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
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No lawyers found matching your criteria</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="available" className="mt-0">
              {filteredLawyers.filter(l => l.available).map((lawyer, index) => (
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
            </TabsContent>
            
            <TabsContent value="top-rated" className="mt-0">
              {filteredLawyers.sort((a, b) => b.rating - a.rating).map((lawyer, index) => (
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Lawyers;
