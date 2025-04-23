import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import ContactsList, { Contact } from './messages/ContactsList';
import ChatArea, { Message } from './messages/ChatArea';

const Messages = () => {
  const { user, profile, isLawyer } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        let { data, error } = isLawyer
          ? await supabase
              .from('profiles')
              .select('id, first_name, last_name, avatar_url')
              .eq('role', 'client')
          : await supabase
              .from('profiles')
              .select('id, first_name, last_name, avatar_url')
              .eq('role', 'lawyer');

        if (error) throw error;

        const contactsData = (data || []).map((contact: any) => ({
          id: contact.id,
          first_name: contact.first_name,
          last_name: contact.last_name,
          avatar_url: contact.avatar_url,
          last_message: 'No messages yet',
          last_message_time: '',
          unread_count: 0,
        }));

        setContacts(contactsData);

        if (contactsData.length > 0) {
          setActiveContact(contactsData[0]);
        }
      } catch (err: any) {
        console.error('Error fetching contacts:', err);
        toast({
          title: 'Error',
          description: 'Failed to load contacts',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [user?.id, isLawyer, toast]);

  // Fetch messages when active contact changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.id || !activeContact) return;

      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            sender_id,
            recipient_id,
            content,
            read,
            created_at,
            sender:profiles!sender_id (
              first_name,
              last_name,
              avatar_url
            )
          `)
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .or(`sender_id.eq.${activeContact.id},recipient_id.eq.${activeContact.id}`)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const filteredMessages = (data || []).filter((msg: any) =>
          (msg.sender_id === user.id && msg.recipient_id === activeContact.id) ||
          (msg.sender_id === activeContact.id && msg.recipient_id === user.id)
        );

        const processedMessages: Message[] = filteredMessages.map((msg: any) => {
          let senderData;
          if (Array.isArray(msg.sender) && msg.sender.length > 0) {
            const s = msg.sender[0];
            senderData = {
              first_name: s.first_name || '',
              last_name: s.last_name || '',
              avatar_url: s.avatar_url || null
            };
          } else if (msg.sender && typeof msg.sender === 'object') {
            senderData = {
              first_name: msg.sender.first_name || '',
              last_name: msg.sender.last_name || '',
              avatar_url: msg.sender.avatar_url || null
            };
          }
          return {
            id: msg.id,
            sender_id: msg.sender_id,
            recipient_id: msg.recipient_id,
            content: msg.content,
            read: msg.read,
            created_at: msg.created_at,
            sender: senderData
          };
        });

        setMessages(processedMessages);

        // Mark as read
        const unreadMessageIds = processedMessages
          .filter((msg: Message) => !msg.read && msg.sender_id === activeContact.id)
          .map((msg: Message) => msg.id);

        if (unreadMessageIds.length > 0) {
          await supabase
            .from('messages')
            .update({ read: true })
            .in('id', unreadMessageIds);
        }
      } catch (err: any) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();

    // Real-time subscription, unchanged for now
    const messagesSubscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${activeContact?.id}`
      }, (payload) => {
        const newMsg = payload.new as Message;
        const processedMsg: Message = {
          ...newMsg,
          sender: undefined,
        };
        setMessages(prevMessages => [...prevMessages, processedMsg]);
        supabase
          .from('messages')
          .update({ read: true })
          .eq('id', newMsg.id);
      })
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [activeContact, user?.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !activeContact) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: activeContact.id,
          content: newMessage,
          read: false,
        })
        .select()
        .single();

      if (error) throw error;

      const messageWithSender: Message = {
        ...data,
        sender: {
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          avatar_url: profile?.avatar_url || null,
        },
      };

      setMessages(prevMessages => [...prevMessages, messageWithSender]);
      setNewMessage('');
    } catch (err: any) {
      console.error('Error sending message:', err);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-legal-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      {contacts.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">No contacts yet</h2>
          <p className="text-gray-500">
            {isLawyer
              ? "You'll see your clients here once you have appointments"
              : "You'll see your lawyers here once you book consultations"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contacts List */}
          <div className="md:col-span-1">
            <ContactsList
              contacts={contacts}
              activeContact={activeContact}
              setActiveContact={setActiveContact}
              isLawyer={isLawyer}
            />
          </div>
          {/* Chat Area */}
          <div className="md:col-span-2">
            <ChatArea
              activeContact={activeContact}
              messages={messages}
              user={user}
              profile={profile}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              handleKeyPress={handleKeyPress}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
