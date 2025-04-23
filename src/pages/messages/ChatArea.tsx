
import React, { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizontal, User } from "lucide-react";
import { format } from "date-fns";

export type MessageSender = {
  first_name: string;
  last_name: string;
  avatar_url: string | null;
};

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: MessageSender;
};

export type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
};

type ChatAreaProps = {
  activeContact: Contact | null;
  messages: Message[];
  user: any;
  profile: any;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
};

const ChatArea: React.FC<ChatAreaProps> = ({
  activeContact,
  messages,
  user,
  profile,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleKeyPress,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!activeContact) {
    return (
      <Card className="h-[70vh] flex flex-col">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Select a contact to start messaging</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[70vh] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={activeContact.avatar_url || undefined}
            alt={`${activeContact.first_name} ${activeContact.last_name}`}
          />
          <AvatarFallback className="bg-legal-primary text-white">
            {activeContact.first_name.charAt(0)}
            {activeContact.last_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h3 className="font-medium">
            {activeContact.first_name} {activeContact.last_name}
          </h3>
        </div>
      </div>
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No messages yet</p>
              <p className="text-sm text-gray-400">
                Send a message to start the conversation
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.sender_id === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start max-w-[80%] ${
                      isCurrentUser ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8 mt-1 mx-2">
                      {isCurrentUser ? (
                        <>
                          <AvatarImage
                            src={profile?.avatar_url || undefined}
                            alt="You"
                          />
                          <AvatarFallback className="bg-legal-primary text-white">
                            {profile?.first_name?.charAt(0)}
                            {profile?.last_name?.charAt(0)}
                          </AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage
                            src={message.sender?.avatar_url || undefined}
                            alt={`${message.sender?.first_name || "User"}`}
                          />
                          <AvatarFallback className="bg-gray-200">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div>
                      <div
                        className={`rounded-lg p-3 ${
                          isCurrentUser
                            ? "bg-legal-primary text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 mx-1">
                        {format(new Date(message.created_at), "p")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex items-center">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            className="ml-2 bg-legal-primary hover:bg-legal-secondary"
            disabled={!newMessage.trim()}
          >
            <SendHorizontal className="h-4 w-4" />
            <span className="ml-2">Send</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatArea;
