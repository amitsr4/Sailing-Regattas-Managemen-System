// src/components/auth/Login.tsx
// @deno-types="npm:@types/react"
import React, { useState } from 'react';
import { useDB, useItem, useQuery } from '@goatdb/goatdb/react';
import { Repository, itemPathGetPart } from '@goatdb/goatdb';
import { kSchemeUISettings, kSchemeUser } from '../../../schema.ts';

export function Login({ userId }: { userId: string }) {
  const [error, setError] = useState<string | null>(null);
  const db = useDB();
  const uiSettings = useItem<typeof kSchemeUISettings>(
    'user',
    userId,
    'UISettings'
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const query = useQuery({
      schema: kSchemeUser,
      source: '/user',
      predicate: (item) =>
        item.get('email') === formData.get('email') &&
        item.get('password') === formData.get('password'),
    });

    const results = query.results();
    if (results.length === 0) {
      setError('Invalid credentials');
      return;
    }

    const user = results[0];
    const userPath = Repository.path(
      'user',
      itemPathGetPart(user.path, 'item')
    );

    // Update UI settings
    uiSettings.set('currentUserId', userPath);
    uiSettings.set('userType', user.get('role'));
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
