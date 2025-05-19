import React from "react";

export default function ContactsGrid({ contacts, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-6 rounded-lg bg-muted animate-pulse h-32" />
        ))}
      </div>
    );
  }

  if (!contacts?.length) {
    return (
      <div className="text-center text-muted-foreground py-12">
        No contacts found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-white dark:bg-zinc-900 border rounded-lg shadow p-5 flex flex-col gap-2"
        >
          <div className="font-bold text-lg">
            {contact.firstName} {contact.lastName}
          </div>
          <div className="text-sm text-muted-foreground">{contact.address}</div>
          <div className="text-xs text-zinc-500">ID: {contact._id}</div>
        </div>
      ))}
    </div>
  );
}
