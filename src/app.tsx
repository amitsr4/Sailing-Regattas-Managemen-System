// @deno-types="npm:@types/react"
import React from 'react';
import { useDBReady, useItem } from '@goatdb/goatdb/react';
import { MainContent } from './components/MainContent.tsx';
import { LandingPage } from './components/LandingPage.tsx';

export function App() {
  const ready = useDBReady();
  const currentSession = useItem('/sys/sessions/current');

  // For development login
  const devUserId = localStorage.getItem('devUserId');

  if (ready === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex items-center space-x-2">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (ready === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">
          Error! Please reload the page.
        </div>
      </div>
    );
  }

  // If user is authenticated (either through dev login or regular auth)
  const userId = devUserId || currentSession?.get('userId');
  if (userId) {
    return <MainContent userId={userId} />;
  }

  // Show landing page with auth options if not authenticated
  return <LandingPage />;
}
