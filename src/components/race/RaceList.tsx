// @deno-types="npm:@types/react"
import React, { useState } from 'react';
import { useQuery } from '@goatdb/goatdb/react';
import { kSchemeRace } from '../../../schema.ts';
import { ensureDate, ensureString } from '../../utils/typeGuards.ts';

interface RaceListProps {
  eventId: string;
  onSelectRace: (raceId: string) => void;
}

export function RaceList({ eventId, onSelectRace }: RaceListProps) {
  const racesQuery = useQuery({
    schema: kSchemeRace,
    source: '/data/races',
    predicate: ({ item }) => String(item.get('eventId')) === eventId,
    sortDescriptor: ({ left, right }) =>
      new Date(right.get('date')).getTime() -
      new Date(left.get('date')).getTime(),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Races</h2>
      {racesQuery.results().map((race) => (
        <div
          key={race.path}
          onClick={() => onSelectRace(race.path)}
          className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{ensureString(race.get('name'))}</h3>
              <p className="text-sm text-gray-500">
                {ensureDate(race.get('date')).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                race.get('status') === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
              {ensureString(race.get('status'))}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
