
import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, FileText, MessageSquare, Plus, Video, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import { format } from "date-fns";

const AppointmentsList = ({ appointments, onJoinMeeting }: { 
  appointments: any[],
  onJoinMeeting: (appointmentId: string) => void
}) => {
  if (!appointments.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No appointments found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => {
        const startTime = new Date(appointment.start_time);
        const endTime = new Date(appointment.end_time);
        const client = appointment.client || {};
        const now = new Date();
        const isNow = startTime <= now && now <= endTime;
        
        return (
          <div
            key={appointment.id}
            className={`border rounded-lg p-4 transition-all ${isNow ? 'border-legal-primary bg-legal-light' : 'border-gray-200'}`}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="flex items-start space-x-3">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {client.avatar_url ? (
                    <img
                      src={client.avatar_url}
                      alt={`${client.first_name} ${client.last_name}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{client.first_name} {client.last_name}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    {format(startTime, 'MMM d, yyyy')}
                    <Clock className="h-3.5 w-3.5 ml-3 mr-1.5" />
                    {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                  </div>
                  {appointment.notes && (
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-medium">Notes:</span> {appointment.notes}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 md:mt-0 ml-0 md:ml-4">
                <Button
                  onClick={() => onJoinMeeting(appointment.id)}
                  disabled={!isNow}
                  className={`${isNow ? 'bg-legal-primary hover:bg-legal-secondary' : 'bg-gray-100 text-gray-500'}`}
                >
                  <Video className="mr-2 h-4 w-4" />
                  {isNow ? "Join Now" : "Join Meeting"}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LawyerDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const {
    getUpcomingAppointments,
    getPastAppointments,
    isLoading,
    error,
  } = useAppointments();
  
  const handleJoinMeeting = (appointmentId: string) => {
    navigate(`/consultation/${appointmentId}`);
  };

  const handleSetAvailability = () => {
    navigate('/availability');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-legal-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-legal-dark">Welcome, {profile?.first_name}</h1>
          <p className="text-gray-500">Manage your appointments and client consultations</p>
        </div>
        <Button 
          onClick={handleSetAvailability} 
          className="mt-4 md:mt-0 bg-legal-primary hover:bg-legal-secondary"
        >
          <Calendar className="mr-2 h-4 w-4" /> Set Availability
        </Button>
      </div>

      <Separator className="my-6" />

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Video className="mr-2 h-5 w-5 text-legal-primary" />
                <CardTitle>Your Appointments</CardTitle>
              </div>
            </div>
            <CardDescription>Manage your scheduled client consultations</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="pt-6">
                <AppointmentsList 
                  appointments={getUpcomingAppointments()} 
                  onJoinMeeting={handleJoinMeeting} 
                />
              </TabsContent>
              <TabsContent value="past" className="pt-6">
                <AppointmentsList 
                  appointments={getPastAppointments()} 
                  onJoinMeeting={handleJoinMeeting} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LawyerDashboard;
