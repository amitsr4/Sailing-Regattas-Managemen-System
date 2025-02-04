// @deno-types="npm:@types/react"
import React, { useEffect } from 'react';
import { useDB, useItem } from '@goatdb/goatdb/react';
import { Ship, LogOut } from 'lucide-react';
import { EventList } from './event/EventList.tsx';
import { kSchemeSailorProfile, kSchemeUISettings } from '../../schema.ts';

interface MainContentProps {
  userId: string;
}

export function MainContent({ userId }: MainContentProps) {
  const userProfile = useItem(`/sys/users/${userId}`);
  const userSettings = useItem(`/user/${userId}/settings`);
  const db = useDB();

  useEffect(() => {
    // Initialize schemas if needed
    if (userProfile.schema.ns === null) {
      userProfile.schema = kSchemeSailorProfile;
    }
    if (userSettings.schema.ns === null) {
      userSettings.schema = kSchemeUISettings;
    }
  }, [userProfile, userSettings]);

  const handleLogout = () => {
    localStorage.removeItem('devUserId');
    window.location.reload();
  };

  // Wait for profile schema to be assigned
  if (userProfile.schema.ns === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex items-center space-x-2">
          <Ship className="w-6 h-6 text-blue-500" />
          <span className="text-lg">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <Ship className="w-8 h-8 text-blue-600" />
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Sailing Regattas
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {userProfile.get('name')?.charAt(0) || '?'}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  {userProfile.get('name') || 'Loading...'}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventList userId={userId} />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-gray-500 text-sm">
            © 2025 Sailing Regattas Management. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
