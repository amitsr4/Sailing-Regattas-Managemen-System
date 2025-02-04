// @deno-types="@types/react"
import React, { useState } from 'react';
import { Ship, Anchor } from 'lucide-react';
import { LoginPrompt } from './auth/LoginPrompt.tsx';
import { ProfileSetup } from './auth/ProfileSetup.tsx';
import { useDB } from '@goatdb/goatdb/react';
import { kSchemeSailorProfile, kSchemeUISettings } from '../../schema.ts';
import { SchemaDataType } from 'https://jsr.io/@goatdb/goatdb/0.0.79/cfds/base/schema.ts';
import { Schema } from 'https://jsr.io/@goatdb/goatdb/0.0.79/mod.ts';

type AuthView = 'landing' | 'login' | 'signup';

export function LandingPage() {
  const [view, setView] = useState<AuthView>('landing');
  const db = useDB();

  // Function to handle user creation and profile setup
  const handleUserCreation = async (formData: SchemaDataType<Schema>) => {
    try {
      // Create user in /sys/users
      const userId = crypto.randomUUID();
      await db.load(`/sys/users/${userId}`, kSchemeSailorProfile, {
        id: userId,
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create user settings in /user/{userId}/settings
      await db.load(`/user/${userId}/settings`, kSchemeUISettings, {
        userId,
        theme: 'light',
        notifications: true,
      });

      return userId;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  };

  const renderAuthContent = () => {
    switch (view) {
      case 'login':
        return <LoginPrompt onSignupClick={() => setView('signup')} />;
      case 'signup':
        return (
          <ProfileSetup
            onSubmit={handleUserCreation}
            onComplete={() => setView('login')}
            onBack={() => setView('landing')}
          />
        );
      default:
        return (
          <div className="text-center">
            <div className="mb-8">
              <Ship className="mx-auto h-16 w-16 text-blue-600" />
              <h1 className="mt-6 text-4xl font-bold text-gray-900">
                Sailing Regattas Management
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
                Your complete solution for organizing, managing, and
                participating in sailing events.
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => setView('login')}
                className="w-64 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Login
              </button>
              <div>
                <button
                  onClick={() => setView('signup')}
                  className="w-64 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-12 items-center justify-center">
        <div className="max-w-md text-white">
          <Anchor className="w-16 h-16 mb-8" />
          <h1 className="text-4xl font-bold mb-6">
            Welcome to Sailing Regattas Management
          </h1>
          <p className="text-xl text-blue-100">
            The complete platform for organizing and managing sailing events.
            Join the community of sailors and event organizers.
          </p>
        </div>
      </div>

      {/* Right side - Auth Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        {renderAuthContent()}
      </div>
    </div>
  );
}
