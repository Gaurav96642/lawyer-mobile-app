
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppointments } from "@/hooks/useAppointments";

const UpcomingAppointments: React.FC = () => {
  const navigate = useNavigate();
  const {
    getUpcomingAppointments,
    isLoading,
    error,
    appointments,
  } = useAppointments();

  // Transform the fetched appointments into the format needed by UI
  const upcomingAppointments = useMemo(() => {
    if (!appointments) return [];
    return getUpcomingAppointments().map((appointment: any) => {
      const lawyer = appointment.lawyer || {};
      return {
        id: appointment.id,
        lawyer: {
          id: lawyer.id,
          name:
            (lawyer.first_name && lawyer.last_name)
              ? `${lawyer.first_name} ${lawyer.last_name}`
              : "Lawyer",
          specialty: lawyer.specialty || "Law",
          image: lawyer.avatar_url,
        },
        date: new Date(appointment.start_time),
        duration: Math.round(
          (new Date(appointment.end_time).getTime() -
            new Date(appointment.start_time).getTime()) /
            60000
        ),
        status: appointment.status,
        meeting_url: appointment.meeting_url,
      };
    });
  }, [appointments, getUpcomingAppointments]);

  // Check if appointment is within 10 minutes of start time
  const isWithinStartWindow = (date: Date): boolean => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    return diffMins <= 10 && diffMins >= -30; // Allow joining 10 min before until 30 min after start time
  };

  const handleJoinConsultation = (appointmentId: string) => {
    navigate(`/consultation/${appointmentId}`);
  };

  if (isLoading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-legal-primary" />
        <span className="ml-4 text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load upcoming appointments.</p>
      </div>
    );
  }

  if (!upcomingAppointments || upcomingAppointments.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No upcoming appointments</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/lawyers")}>
          Book Your First Consultation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcomingAppointments.map((appointment) => {
        const canJoin = isWithinStartWindow(appointment.date) && !!appointment.meeting_url;
        return (
          <div
            key={appointment.id}
            className={cn(
              "border rounded-lg p-4 transition-all",
              canJoin ? "border-legal-primary bg-legal-light" : "border-gray-200"
            )}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="flex items-start space-x-3">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {appointment.lawyer.image ? (
                    <img
                      src={appointment.lawyer.image}
                      alt={appointment.lawyer.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{appointment.lawyer.name}</h3>
                  <p className="text-sm text-gray-500">{appointment.lawyer.specialty}</p>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    {appointment.date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                    <Clock className="h-3.5 w-3.5 ml-3 mr-1.5" />
                    {appointment.date.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    <span className="ml-1.5">({appointment.duration} min)</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 ml-0 md:ml-4">
                <Button
                  onClick={() => handleJoinConsultation(appointment.id)}
                  disabled={!canJoin}
                  className={cn(
                    canJoin ? "bg-legal-primary hover:bg-legal-secondary" : "bg-gray-100 text-gray-500"
                  )}
                >
                  <Video className="mr-2 h-4 w-4" />
                  {canJoin ? "Join Now" : "Join Consultation"}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UpcomingAppointments;
