
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getNotifications, markNotificationAsRead } from '@/services/notificationService';
import { useState } from 'react';

export type NotificationType = {
  id: string;
  user_id: string;
  type: 'appointment_reminder' | 'new_message' | 'appointment_confirmation' | 'appointment_cancellation';
  title: string;
  message: string;
  read: boolean;
  data: any;
  created_at: string;
};

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await getNotifications(user.id);
      
      if (error) throw error;
      
      // Calculate unread count
      const unreadNotifications = data?.filter((notification: NotificationType) => !notification.read) || [];
      setUnreadCount(unreadNotifications.length);
      
      return data as NotificationType[];
    },
    enabled: !!user?.id,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  return {
    notifications,
    isLoading,
    error,
    markAsRead,
    unreadCount,
  };
};
