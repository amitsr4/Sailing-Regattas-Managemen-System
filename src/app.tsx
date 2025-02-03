// @deno-types="npm:@types/react"
import React from 'react';
import { useDBReady, useItem } from '@goatdb/goatdb/react';
import { kSchemeUISettings, kSchemeSailorProfile } from '../schema.ts';
import { EventList } from './components/event/EventList.tsx';
import { LoginPrompt } from './components/auth/LoginPrompt.tsx';

interface MainContentProps {
  userId: string;
}
function MainContent({ userId }: MainContentProps) {
  const profile = useItem(`/sys/users/${userId}`);
  const uiSettings = useItem(`/user/${userId}/UISettings`); // User settings go in /user

  React.useEffect(() => {
    if (uiSettings.schema.ns === null) {
      uiSettings.schema = kSchemeUISettings;
    }
  }, [uiSettings]);

  if (profile.schema.ns === null) {
    profile.schema = kSchemeSailorProfile;
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl font-bold">Sailing Regattas</div>
            <div className="flex items-center space-x-4">
              <span>{String(profile.get('name'))}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('devUserId');
                  window.location.reload();
                }}
                className="text-gray-600 hover:text-gray-900">
                Logout
              </button>

              {/* <button
                onClick={() => uiSettings.set('currentUserId', null)}
                className="text-gray-600 hover:text-gray-900">
                Logout
              </button> */}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventList userId={userId} />
      </main>
    </div>
  );
}

// export function App() {
//   const ready = useDBReady();
//   const currentUser = useItem('/sys/user');

//   console.log('App rendering, ready state:', ready);

//   // Handle loading state
//   if (ready === 'loading') {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-xl">Loading...</div>
//       </div>
//     );
//   }

//   // Handle error state
//   if (ready === 'error') {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-xl text-red-600">
//           Error! Please reload the page.
//         </div>
//       </div>
//     );
//   }

//   // Handle unauthenticated state
//   if (!currentUser || currentUser.schema.ns === null) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <LoginPrompt />
//       </div>
//     );
//   }

//   // Show main content when authenticated
//   return <MainContent userId={currentUser.path} />;
// }
// src/app.tsx
// In your App component, update the authentication check:

export function App() {
  const ready = useDBReady();
  const currentUser = useItem('/sys/user');

  // Add dev login check
  const devUserId = localStorage.getItem('devUserId');

  console.log('App rendering, ready state:', ready);

  if (ready === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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

  // Check for dev login
  if (devUserId) {
    return <MainContent userId={devUserId} />;
  }

  // Show login if no user is authenticated
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginPrompt />
    </div>
  );
}
