// @deno-types="npm:@types/react"
import React, { JSX } from 'react';
import { EventCardProps } from '../../../types/index.tsx';

type StatusColor = {
  bg: string;
  text: string;
};

export function EventCard({ event, userId, onEventClick }: EventCardProps) {
  const startDateValue = event.get('start_date');
  const endDateValue = event.get('end_date');

  const startDate =
    startDateValue instanceof Date ? startDateValue : new Date();
  const endDate = endDateValue instanceof Date ? endDateValue : new Date();

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
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">{String(event.get('name'))}</h3>
          <span
            className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
              status
            )}`}>
            {status}
          </span>
        </div>

        <div className="space-y-2 text-gray-600">
          <p>{String(event.get('location'))}</p>
          <p>
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </p>
          <p className="font-medium">
            Entry Fee: ${Number(event.get('entry_fee')).toFixed(2)}
          </p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Participants: {(event.get('participants') as Set<string>).size}
          </span>
        </div>
      </div>
    </div>
  );
}
