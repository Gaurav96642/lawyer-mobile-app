
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

type Message = {
  id: string;
  sender: "client" | "lawyer";
  text: string;
  timestamp: Date;
  read: boolean;
};

// Mock messages
const initialMessages: Message[] = [
  {
    id: "msg-1",
    sender: "lawyer",
    text: "Hello, I've reviewed your documents and have a few questions before our consultation.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: true,
  },
  {
    id: "msg-2",
    sender: "client",
    text: "Sure, I'm available now to discuss. What questions do you have?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
  },
  {
    id: "msg-3",
    sender: "lawyer",
    text: "Could you please confirm the dates mentioned in the property document? Also, do you have the original purchase agreement?",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: true,
  },
];

const SecureMessaging: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState<string>("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      sender: "client",
      text: newMessage.trim(),
      timestamp: new Date(),
      read: false,
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[300px]">
      <ScrollArea className="flex-grow mb-4 pr-4">
        <div className="space-y-3">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === "client" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === "client"
                    ? "bg-legal-primary text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === "client" ? "text-white/70" : "text-gray-500"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="flex">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a secure message..."
          className="flex-grow"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="ml-2 bg-legal-primary hover:bg-legal-secondary"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SecureMessaging;
