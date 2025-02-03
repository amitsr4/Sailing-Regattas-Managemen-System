// src/components/event/EventList.tsx
// @deno-types="npm:@types/react"
import React, { useState } from 'react';
import { useDB, useQuery, useItem } from '@goatdb/goatdb/react';
import { kSchemeEvent, kSchemeSailorProfile } from '../../../../schema.ts';
import { EventCard } from './shared/EventCard.tsx';
import { EventCreate } from './EventCreate.tsx';

export function EventList({ userId }: { userId: string }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const db = useDB();

  const userProfile = useItem(`/user/${userId}/profile`);
  const canCreateEvent =
    userProfile.schema.ns === kSchemeSailorProfile.ns &&
    (userProfile.get('type') === 'club' ||
      userProfile.get('type') === 'seriesOrganizer');

  const eventsQuery = useQuery({
    schema: kSchemeEvent,
    source: '/data/events',
    sortDescriptor: ({ left, right }) => {
      const leftDate = left.get('start_date');
      const rightDate = right.get('start_date');
      if (leftDate instanceof Date && rightDate instanceof Date) {
        return rightDate.getTime() - leftDate.getTime();
      }
      return 0;
    },
  });

  const handleEventClick = (eventId: string) => {
    // Handle event click
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        {canCreateEvent && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Create Event
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsQuery.results().map((event) => (
          <EventCard
            key={event.path}
            event={event}
            userId={userId}
            onEventClick={handleEventClick}
          />
        ))}
      </div>

      {showCreateModal && (
        <EventCreate
          userId={userId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
