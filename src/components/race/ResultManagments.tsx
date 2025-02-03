// @deno-types="npm:@types/react"
import React, { useState } from 'react';
import { useDB, useItem, useQuery } from '@goatdb/goatdb/react';
import { kSchemeBoat, kSchemeRaceResult } from '../../../schema.ts';
import { ensureNumber, ensureString } from '../../utils/typeGuards.ts';

interface ResultsManagementProps {
  eventId: string;
}

export function ResultsManagement({ eventId }: ResultsManagementProps) {
  const db = useDB();
  const [selectedBoatId, setSelectedBoatId] = useState('');
  const [finishTime, setFinishTime] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Get registered boats
  const boatsQuery = useQuery({
    schema: kSchemeBoat,
    source: '/data/boats',
    predicate: ({ item }) => {
      const events = item.get('participatingEvents') as Set<string>;
      return events.has(eventId);
    },
  });

  // Get existing results
  const resultsQuery = useQuery({
    schema: kSchemeRaceResult,
    source: '/data/results',
    predicate: ({ item }) => String(item.get('eventId')) === eventId,
    sortDescriptor: ({ left, right }) =>
      ensureNumber(left.get('position')) - ensureNumber(right.get('position')),
  });

  const handleSubmitResult = () => {
    try {
      if (!selectedBoatId || !finishTime) {
        setError('Please fill in all fields');
        return;
      }

      // Create new result
      const resultId = crypto.randomUUID();
      db.create(`/data/results/${resultId}`, kSchemeRaceResult, {
        eventId,
        boatId: selectedBoatId,
        finishTime: new Date(finishTime),
        position: resultsQuery.results().length + 1,
      });

      // Reset form
      setSelectedBoatId('');
      setFinishTime('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add result');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Race Results</h2>

      {/* Result Entry Form */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-4">Enter Result</h3>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
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

      {/* Results Display */}
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
            {resultsQuery.results().map((result) => (
              <ResultRow key={result.path} result={result} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResultRow({ result }: { result: any }) {
  const boat = useItem(`/data/boats/${result.get('boatId')}`);

  return (
    <tr className="border-t">
      <td className="py-2">{ensureNumber(result.get('position'))}</td>
      <td className="py-2">
        {ensureString(boat.get('name'))} -{' '}
        {ensureString(boat.get('sail_number'))}
      </td>
      <td className="py-2">
        {new Date(result.get('finishTime')).toLocaleString()}
      </td>
    </tr>
  );
}
