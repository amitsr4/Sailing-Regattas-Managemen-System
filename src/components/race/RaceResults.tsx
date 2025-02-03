// @deno-types="npm:@types/react"
import React, { useState } from 'react';
import { useItem, useQuery } from '@goatdb/goatdb/react';
import { kSchemeBoat } from '../../../schema.ts';
import { ensureMap, ensureString } from '../../utils/typeGuards.ts';

interface RaceResultsProps {
  raceId: string;
  eventId: string;
  onBack: () => void;
}

export function RaceResults({ raceId, eventId, onBack }: RaceResultsProps) {
  const race = useItem(`/data/races/${raceId}`);
  const [selectedBoatId, setSelectedBoatId] = useState('');
  const [finishTime, setFinishTime] = useState('');

  // Query boats registered for this event
  const boatsQuery = useQuery({
    schema: kSchemeBoat,
    source: '/data/boats',
    predicate: ({ item }) => {
      const events = item.get('participatingEvents') as Set<string>;
      return events.has(eventId);
    },
  });
  const results = ensureMap(race.get('results'));

  const sortedResults = Array.from(results.entries()).sort(
    ([, a], [, b]) => a.position - b.position
  );

  const handleSubmitResult = () => {
    if (!selectedBoatId || !finishTime) return;

    results.set(selectedBoatId, {
      finishTime: new Date(finishTime),
      position: results.size + 1,
    });

    race.set('results', results);
    race.set('updatedAt', new Date());

    // Clear form
    setSelectedBoatId('');
    setFinishTime('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-blue-500 hover:text-blue-700">
          ← Back to Races
        </button>
        <h2 className="text-xl font-bold">
          {ensureString(race.get('name'))} Results
        </h2>
      </div>

      {/* Enter Results Form */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-4">Enter Result</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Boat</label>
            <select
              value={selectedBoatId}
              onChange={(e) => setSelectedBoatId(e.target.value)}
              className="w-full p-2 border rounded">
              <option value="">Select boat</option>
              {boatsQuery.results().map((boat) => (
                <option key={boat.path} value={boat.path}>
                  {ensureString(boat.get('name'))} -{' '}
                  {ensureString(boat.get('sail_number'))}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Finish Time
            </label>
            <input
              type="datetime-local"
              value={finishTime}
              onChange={(e) => setFinishTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleSubmitResult}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Result
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-4">Current Results</h3>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-2">Position</th>
              <th className="pb-2">Boat</th>
              <th className="pb-2">Finish Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map(([boatId, result]) => (
              <ResultRow
                key={boatId}
                boatId={boatId}
                position={result.position}
                finishTime={result.finishTime}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ResultRowProps {
  boatId: string;
  position: number;
  finishTime: Date;
}

function ResultRow({ boatId, position, finishTime }: ResultRowProps) {
  const boat = useItem(`/data/boats/${boatId}`);

  return (
    <tr className="border-t">
      <td className="py-2">{position}</td>
      <td className="py-2">
        {ensureString(boat.get('name'))} -{' '}
        {ensureString(boat.get('sail_number'))}
      </td>
      <td className="py-2">{new Date(finishTime).toLocaleString()}</td>
    </tr>
  );
}
