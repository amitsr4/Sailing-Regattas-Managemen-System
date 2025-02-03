// src/components/auth/ProfileSetup.tsx
// @deno-types="npm:@types/react"
import React, { JSX, useState } from 'react';
import { useDB } from '@goatdb/goatdb/react';
import { kSchemeSailorProfile } from '../../../schema.ts';
import { ProfileFormData, ProfileSetupProps } from '../../types/index.tsx';

export function ProfileSetup({
  userId,
  onComplete,
}: ProfileSetupProps): JSX.Element {
  const [formData, setFormData] = useState<ProfileFormData>({
    type: 'individual',
    role: 'competitor',
    name: '',
    mobile: '',
    location: '',
  });
  const [error, setError] = useState<string | null>(null);
  const db = useDB();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const profile = db.create(
        `/user/${userId}/profile`,
        kSchemeSailorProfile,
        {
          ...formData,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );

      onComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Account Type</label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                type: e.target.value as ProfileFormData['type'],
              }))
            }
            className="w-full p-2 border rounded"
            required>
            <option value="">Select account type</option>
            <option value="individual">Individual</option>
            <option value="club">Club</option>
            <option value="seriesOrganizer">Series Organizer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mobile</label>
          <input
            type="tel"
            value={formData.mobile}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                mobile: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                location: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Complete Setup
        </button>
      </form>
    </div>
  );
}
