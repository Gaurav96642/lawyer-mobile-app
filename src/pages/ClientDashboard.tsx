
import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, FileText, MessageSquare, Plus, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";
import DocumentUpload from "@/components/dashboard/DocumentUpload";
import SecureMessaging from "@/components/dashboard/SecureMessaging";

const ClientDashboard = () => {
  const navigate = useNavigate();
  
  // Mock user data - this would come from auth context in a real app
  const user = {
    name: "Sarah Johnson",
    email: "sarah@example.com",
  };

  const handleBookConsultation = () => {
    navigate("/lawyers");
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-legal-dark">Welcome, {user.name}</h1>
          <p className="text-gray-500">Manage your legal consultations and documents</p>
        </div>
        <Button 
          onClick={handleBookConsultation} 
          className="mt-4 md:mt-0 bg-legal-primary hover:bg-legal-secondary"
        >
          <Plus className="mr-2 h-4 w-4" /> Book New Consultation
        </Button>
      </div>

      <Separator className="my-6" />

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Appointments - Takes 2/3 of space on desktop */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-legal-primary" />
                  <CardTitle>Upcoming Appointments</CardTitle>
                </div>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <CardDescription>Your scheduled legal consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <UpcomingAppointments />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-legal-primary" />
                <CardTitle>Secure Messages</CardTitle>
              </div>
              <CardDescription>Communicate securely with your legal advisor</CardDescription>
            </CardHeader>
            <CardContent>
              <SecureMessaging />
            </CardContent>
          </Card>
        </div>

        {/* Document Upload Zone - Takes 1/3 of space on desktop */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-legal-primary" />
                <CardTitle>Documents</CardTitle>
              </div>
              <CardDescription>Upload and manage your legal documents</CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-8rem)]">
              <DocumentUpload />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
