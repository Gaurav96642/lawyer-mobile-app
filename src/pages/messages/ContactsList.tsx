
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
};

type ContactsListProps = {
  contacts: Contact[];
  activeContact: Contact | null;
  setActiveContact: (contact: Contact) => void;
  isLawyer: boolean;
};

const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  activeContact,
  setActiveContact,
  isLawyer,
}) => (
  <Card className="h-[70vh]">
    <ScrollArea className="h-full">
      <div className="p-4">
        <h2 className="font-medium mb-4">Contacts</h2>
        {contacts.map((contact) => (
          <React.Fragment key={contact.id}>
            <div
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                activeContact?.id === contact.id
                  ? "bg-legal-light"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveContact(contact)}
              data-testid={`contact-item-${contact.id}`}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={contact.avatar_url || undefined}
                  alt={`${contact.first_name} ${contact.last_name}`}
                />
                <AvatarFallback className="bg-legal-primary text-white">
                  {contact.first_name.charAt(0)}
                  {contact.last_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {contact.first_name} {contact.last_name}
                  </span>
                  {contact.last_message_time && (
                    <span className="text-xs text-gray-500">
                      {contact.last_message_time}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {contact.last_message}
                </p>
              </div>
              {contact.unread_count > 0 && (
                <span className="bg-legal-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                  {contact.unread_count}
                </span>
              )}
            </div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  </Card>
);

export default ContactsList;
