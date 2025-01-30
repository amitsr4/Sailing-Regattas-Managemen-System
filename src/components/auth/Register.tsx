// @deno-types="npm:@types/react"
import React, { useState } from 'react';
import { useDB, useItem, useQuery } from '@goatdb/goatdb/react';
import {
  kSchemeClub,
  kSchemeIndividual,
  kSchemeSeriesOrganizer,
  kSchemeUISettings,
  kSchemeUser,
} from '../../../schema.ts';
import { Repository } from '@goatdb/goatdb';

export function Register({ userId }: { userId: string }) {
  const db = useDB();
  const [error, setError] = useState<string | null>(null);
  const uiSettings = useItem('user', userId, 'UISettings');

  // Ensure schema is set
  if (uiSettings.schema.ns === null) {
    uiSettings.schema = kSchemeUISettings;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const existingQuery = useQuery({
        schema: kSchemeUser,
        source: '/user',
        predicate: (item) => item.get('email') === formData.get('email'),
      });

      if (existingQuery.results().length > 0) {
        setError('Email already registered');
        return;
      }

      // Create new user
      const newUserId = crypto.randomUUID();
      const userPath = Repository.path('user', newUserId);

      const user = db.create(userPath, kSchemeUser, {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        mobile: formData.get('mobile'),
        location: formData.get('location'),
        role: formData.get('role') || 'competitor',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Auto login after registration
      uiSettings.set('currentUserId', userPath);
      uiSettings.set('userType', user.get('role'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userType">Account Type</label>
          <select
            id="userType"
            name="userType"
            required
            className="w-full p-2 border rounded">
            <option value="">Select account type</option>
            <option value="individual">Individual</option>
            <option value="club">Club</option>
            <option value="seriesOrganizer">Series Organizer</option>
          </select>
        </div>

        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="mobile">Mobile</label>
            <input
              id="mobile"
              name="mobile"
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <RoleSelect name="role" userType={FormData.get('userType') as string} />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded py-2">
          Register
        </button>
      </form>
    </div>
  );
}

// Helper function for getting the correct schema
function getSchemaForUserType(type: string) {
  switch (type) {
    case 'club':
      return kSchemeClub;
    case 'seriesOrganizer':
      return kSchemeSeriesOrganizer;
    case 'individual':
      return kSchemeIndividual;
    default:
      throw new Error('Invalid user type');
  }
}

// Role selection component
function RoleSelect({ name, userType }: { name: string; userType: string }) {
  if (userType === 'individual') return null;

  return (
    <div>
      <label htmlFor={name}>Role</label>
      <select
        id={name}
        name={name}
        required
        className="w-full p-2 border rounded">
        <option value="">Select role</option>
        {userType === 'club' ? (
          <>
            <option value="admin">Admin</option>
            <option value="clubManager">Club Manager</option>
            <option value="raceOfficer">Race Officer</option>
            <option value="competitor">Competitor</option>
          </>
        ) : (
          <>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="raceOfficer">Race Officer</option>
            <option value="competitor">Competitor</option>
          </>
        )}
      </select>
    </div>
  );
}
