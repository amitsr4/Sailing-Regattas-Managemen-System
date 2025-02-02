// src/App.tsx
// @deno-types="npm:@types/react"
import React from 'react';
import { useDB, useDBReady, useItem } from '@goatdb/goatdb/react';
import { kSchemeUISettings, kSchemeSailorProfile } from './schema';
import { ProfileSetup } from './components/auth/ProfileSetup.tsx';
import { LoginPrompt } from './components/auth/LoginPrompt.tsx';

function MainApp({ userId }: { userId: string }) {
  const db = useDB();
  const profile = useItem(`/user/${userId}/profile`);

  // Check if user has completed profile setup
  if (profile.schema.ns === null) {
    profile.schema = kSchemeSailorProfile;
    return <ProfileSetup userId={userId} />;
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-md p-4">
        {/* Navigation will go here */}
      </nav>
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Welcome, {profile.get('name')}</h1>
        {/* Main content will go here */}
      </main>
    </div>
  );
}

export function App() {
  const ready = useDBReady();
  const db = useDB();

  // Handle initial loading
  if (ready === 'loading') {
    return <div className="p-4">Loading...</div>;
  }

  if (ready === 'error') {
    return <div className="p-4 text-red-500">Error loading application!</div>;
  }

  // Check authentication status
  // const session = db.getSession();
  // if (!session || !session.owner) {
  return <LoginPrompt />;
  // }

  // return <MainApp userId={session.owner} />;
}
