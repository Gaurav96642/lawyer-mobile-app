
import React from 'react';
import { Bell } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications, NotificationType } from '@/hooks/useNotifications';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const NotificationItem: React.FC<{
  notification: NotificationType;
  onMarkAsRead: (id: string) => void;
}> = ({ notification, onMarkAsRead }) => {
  const getIconByType = (type: NotificationType['type']) => {
    switch (type) {
      case 'appointment_reminder':
      case 'appointment_confirmation':
      case 'appointment_cancellation':
        return 'bg-blue-100 text-blue-600';
      case 'new_message':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <DropdownMenuItem
      className={cn(
        'flex items-start p-3 cursor-default',
        !notification.read && 'bg-gray-50'
      )}
      onSelect={(e) => {
        e.preventDefault();
        if (!notification.read) {
          onMarkAsRead(notification.id);
        }
      }}
    >
      <div className="w-full">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{notification.title}</span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs mt-2 h-7 px-2"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
          >
            Mark as read
          </Button>
        )}
      </div>
    </DropdownMenuItem>
  );
};

const NotificationsDropdown: React.FC = () => {
  const { notifications, isLoading, error, markAsRead, unreadCount } = useNotifications();
  const { toast } = useToast();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <h3 className="font-medium">Notifications</h3>
          <p className="text-xs text-gray-500">
            You have {unreadCount} unread notification{unreadCount !== 1 && 's'}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          <DropdownMenuGroup>
            {isLoading ? (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-sm text-red-500">Failed to load notifications.</p>
              </div>
            ) : notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <NotificationItem 
                    notification={notification} 
                    onMarkAsRead={markAsRead} 
                  />
                  <DropdownMenuSeparator />
                </React.Fragment>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500">No notifications</p>
              </div>
            )}
          </DropdownMenuGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
