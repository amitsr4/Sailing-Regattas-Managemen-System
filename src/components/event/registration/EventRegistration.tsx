// @deno-types="npm:@types/react"
import React, { useState } from 'react';
import { useItem, useQuery } from '@goatdb/goatdb/react';
import { kSchemeBoat } from '../../../../schema.ts';
import { ensureDate } from '../../../utils/typeGuards.ts';

interface RegistrationFormProps {
  eventId: string;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EventRegistration({
  eventId,
  userId,
  onSuccess,
  onCancel,
}: RegistrationFormProps) {
  const [selectedBoatId, setSelectedBoatId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const boatsQuery = useQuery({
    schema: kSchemeBoat,
    source: '/data/boats',
    predicate: ({ item }) => String(item.get('owner_id')) === userId,
  });

  // Get event for registration
  const event = useItem(`/data/events/${eventId}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!selectedBoatId) {
        setError('Please select a boat');
        return;
      }

      // Get sets from event
      const participants = event.get('participants') as Set<string>;
      const participatingBoats = event.get('participatingBoats') as Set<string>;

      // Add to event's participants
      participants.add(userId);
      participatingBoats.add(selectedBoatId);

      // Update event
      event.set('participants', participants);
      event.set('participatingBoats', participatingBoats);

      // Get boat and update its participating events
      const boat = useItem(`/data/boats/${selectedBoatId}`);
      const boatEvents = boat.get('participatingEvents') as Set<string>;
      boatEvents.add(eventId);
      boat.set('participatingEvents', boatEvents);

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Register for Event</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Boat Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Boat
            </label>
            {boatsQuery.results().length > 0 ? (
              <select
                value={selectedBoatId}
                onChange={(e) => setSelectedBoatId(e.target.value)}
                className="w-full p-2 border rounded"
                required>
                <option value="">Select a boat</option>
                {boatsQuery.results().map((boat) => (
                  <option key={boat.path} value={boat.path}>
                    {String(boat.get('name'))} -{' '}
                    {String(boat.get('sail_number'))}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-red-500">
                No boats found. Please add a boat first.
              </div>
            )}
          </div>

          {/* Event Details Summary */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-2">Event Details:</h3>
            <p>Event: {String(event.get('name'))}</p>
            <p>
              Date: {ensureDate(event.get('start_date')).toLocaleDateString()}
            </p>
            <p>Entry Fee: ${Number(event.get('entry_fee')).toFixed(2)}</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded hover:bg-gray-100">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!selectedBoatId}>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
