// @deno-types="npm:@types/react"
import React, { JSX } from 'react';
import { EventCardProps } from '../../../../types/index.tsx';

type StatusColor = {
  bg: string;
  text: string;
};

export function EventCard({ event, userId, onEventClick }: EventCardProps) {
  const startDate = new Date(event.get('start_date'));
  const endDate = new Date(event.get('end_date'));
  const status = String(event.get('status'));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={() => onEventClick?.(event.path)}>
      <div className="p-6">
        <h3 className="text-xl font-semibold">{String(event.get('name'))}</h3>
        <p>{status}</p>
      </div>

      <div className="space-y-2 text-gray-600">
        <p>{event.get('location')}</p>
        <p>
          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </p>
        <p className="font-medium">Entry Fee: ${event.get('entry_fee')}</p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {event.get('participants').size} Participants
        </span>
        <button
          onClick={() => {
            /* Navigate to event details */
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          View Details
        </button>
      </div>
    </div>
  );
}
