
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getClientAppointments, 
  getLawyerAppointments,
  createAppointment,
  updateAppointmentStatus
} from '@/services/appointmentService';
import { useToast } from '@/components/ui/use-toast';

export const useAppointments = () => {
  const { user, profile, isLawyer } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchAppointments = async () => {
    if (!user?.id || !profile) return [];
    
    const { data, error } = isLawyer 
      ? await getLawyerAppointments(user.id)
      : await getClientAppointments(user.id);
      
    if (error) throw error;
    return data;
  };

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: fetchAppointments,
    enabled: !!user?.id && !!profile,
  });

  const bookAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Appointment booked successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to book appointment.',
        variant: 'destructive',
      });
    }
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'scheduled' | 'completed' | 'canceled' }) => 
      updateAppointmentStatus(id, status),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Appointment status updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update appointment status.',
        variant: 'destructive',
      });
    }
  });

  // Function to filter appointments by status
  const getUpcomingAppointments = () => {
    if (!appointments) return [];
    return appointments.filter(
      (appointment: any) => appointment.status === 'scheduled' && new Date(appointment.start_time) > new Date()
    );
  };

  const getPastAppointments = () => {
    if (!appointments) return [];
    return appointments.filter(
      (appointment: any) => 
        appointment.status === 'completed' || 
        (appointment.status === 'scheduled' && new Date(appointment.start_time) < new Date())
    );
  };

  const getCancelledAppointments = () => {
    if (!appointments) return [];
    return appointments.filter(
      (appointment: any) => appointment.status === 'canceled'
    );
  };

  return {
    appointments,
    isLoading,
    error,
    bookAppointment: bookAppointmentMutation.mutate,
    updateAppointmentStatus: updateAppointmentMutation.mutate,
    getUpcomingAppointments,
    getPastAppointments,
    getCancelledAppointments,
  };
};
