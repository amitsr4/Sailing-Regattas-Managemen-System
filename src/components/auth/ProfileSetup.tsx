// @deno-types="npm:@types/react"
import React, { useState } from 'react';
import { useDB, useItem } from '@goatdb/goatdb/react';
import { kSchemeSailorProfile } from '../../../schema.ts';

export function ProfileSetup({ userId }: { userId: string }) {
  const [formData, setFormData] = useState({
    type: '',
    role: '',
    name: '',
    mobile: '',
    location: '',
  });
  const db = useDB();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const profile = db.create(`/user/${userId}/profile`, kSchemeSailorProfile, {
      ...formData,
      userId,
    });
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Account Type</label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, type: e.target.value }))
            }
            className="w-full p-2 border rounded"
            required>
            <option value="">Select account type</option>
            <option value="individual">Individual</option>
            <option value="club">Club</option>
            <option value="seriesOrganizer">Series Organizer</option>
          </select>
        </div>

        {/* Add other form fields */}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Complete Setup
        </button>
      </form>
    </div>
  );
}
