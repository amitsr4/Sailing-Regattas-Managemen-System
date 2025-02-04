// @deno-types="npm:@types/react"
import React, { useState } from 'react';
import { useItem } from '@goatdb/goatdb/react';
import { kSchemeEvent } from '../../../schema.ts';
import { EventRegistration } from './registration/EventRegistration.tsx';
import {
  ensureDate,
  ensureNumber,
  ensureString,
} from '../../utils/typeGuards.ts';
import { RaceResults } from '../race/RaceResults.tsx';
import { RaceList } from '../race/RaceList.tsx';
import { ResultsManagement } from '../race/ResultManagments.tsx';

interface EventDetailsProps {
  eventId: string;
  userId: string;
  onBack: () => void;
}

export function EventDetails({ eventId, userId, onBack }: EventDetailsProps) {
  const event = useItem(`/data/events/${eventId}`);
  const userProfile = useItem(`/sys/users/${userId}`);
  const userBoats = useItem(`/data/users/${userId}/boats`);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedRaceId, setSelectedRaceId] = useState<string | null>(null);

  if (event.schema.ns === null) {
    event.schema = kSchemeEvent;
    return <div>Loading...</div>;
  }

  const isRegistered = (event.get('participants') as Set<string>).size > 0;
  const status = String(event.get('status'));

  const handleRegister = async () => {
    const participants = event.get('participants') as Set<string>;
    participants.add(userId);
    event.set('participants', participants);
  };

  if (selectedRaceId) {
    return (
      <RaceResults
        raceId={selectedRaceId}
        eventId={eventId}
        onBack={() => setSelectedRaceId(null)}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-blue-500 hover:text-blue-700">
          ← Back to Events
        </button>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            status === 'published'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100'
          }`}>
          {status}
        </span>
      </div>

      {/* Event Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">{String(event.get('name'))}</h1>
        <div className="space-y-2">
          <p>
            <strong>Location:</strong> {ensureString(event.get('location'))}
          </p>
          <p>
            <strong>Dates:</strong>{' '}
            {ensureDate(event.get('start_date')).toLocaleDateString()} -{' '}
            {ensureDate(event.get('end_date')).toLocaleDateString()}
          </p>
          <p>
            <strong>Entry Fee:</strong> $
            {ensureNumber(event.get('entry_fee')).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Registration Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Registration</h2>
        {!isRegistered ? (
          <button
            onClick={() => handleRegister()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={status == 'published'}>
            Register for Event
          </button>
        ) : (
          <div className="text-green-600">
            You are registered for this event
          </div>
        )}
      </div>
      {showRegistrationForm && (
        <EventRegistration
          eventId={eventId}
          userId={userId}
          onSuccess={() => {
            setShowRegistrationForm(false);
          }}
          onCancel={() => setShowRegistrationForm(false)}
        />
      )}

      {/* Participants List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Participants</h2>
        <div className="space-y-2">
          {Array.from(event.get('participants') as Set<string>).map(
            (participantId) => (
              <ParticipantRow
                key={participantId}
                participantId={participantId}
              />
            )
          )}
          {(event.get('participants') as Set<string>).size === 0 && (
            <p className="text-gray-500">No participants registered yet.</p>
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        Race List:
        <RaceList eventId={eventId} onSelectRace={setSelectedRaceId} />
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        Result Management:
        <ResultsManagement eventId={eventId} />
      </div>
    </div>
  );
}

// Helper component for participant rows
function ParticipantRow({ participantId }: { participantId: string }) {
  const participant = useItem(`/data/users/${participantId}/profile`);

  if (participant.schema.ns === null) {
    return <div>Loading participant...</div>;
  }

  return (
    <div className="flex justify-between items-center p-2 hover:bg-gray-50">
      <span>{String(participant.get('name'))}</span>
    </div>
  );
}
