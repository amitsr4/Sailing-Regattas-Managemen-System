// @deno-types="npm:@types/react"
import React from 'react';
import { useDBReady, useItem } from '@goatdb/goatdb/react';
import { Login } from './components/auth/Login.tsx';
import { Register } from './components/auth/Register.tsx';
import { kSchemeUISettings } from '../schema.ts';

function AuthScreen({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = React.useState<'login' | 'register'>(
    'login'
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-5">
      <div className="mb-5">
        <button
          className={`px-5 py-2 mr-2 rounded ${
            activeTab === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setActiveTab('login')}>
          Login
        </button>
        <button
          className={`px-5 py-2 rounded ${
            activeTab === 'register' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setActiveTab('register')}>
          Register
        </button>
      </div>
      {activeTab === 'login' ? (
        <Login userId={userId} />
      ) : (
        <Register userId={userId} />
      )}
    </div>
  );
}

function MainApp({ userId }: { userId: string }) {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">
        Welcome to Sailing Regattas Management System!
      </h1>
    </div>
  );
}

export function App() {
  const ready = useDBReady();
  const userId = 'defaultUser';
  const uiSettings = useItem('user', userId, 'UISettings');

  if (ready === 'loading') {
    return <div className="p-5">Loading...</div>;
  }

  if (ready === 'error') {
    return (
      <div className="p-5 text-red-500">Error! Please reload the page.</div>
    );
  }

  if (uiSettings.schema.ns === null) {
    uiSettings.schema = kSchemeUISettings;
    return null;
  }

  const currentUserId = uiSettings.get('currentUserId');

  const handleLogout = () => {
    uiSettings.set('currentUserId', null);
    uiSettings.set('userType', null);
  };

  return (
    <div className="min-h-screen">
      {currentUserId ? (
        <>
          <div className="p-4 border-b flex justify-end">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
              Logout
            </button>
          </div>
          <MainApp userId={userId} />
        </>
      ) : (
        <AuthScreen userId={userId} />
      )}
    </div>
  );
}
