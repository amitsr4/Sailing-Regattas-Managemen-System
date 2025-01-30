import { SchemaManager } from '@goatdb/goatdb';

export const kSchemeUser = {
  ns: 'user',
  version: 1,
  fields: {
    currentUserId: {
      type: 'string',
    },
    userType: {
      type: 'string',
    },
  },
} as const;

export const kSchemeUISettings = {
  ns: 'uiSettings',
  version: 1,
  fields: {
    currentUserId: {
      type: 'string', // Stores the current logged-in user's ID
    },
    userType: {
      type: 'string', // Stores the type of user (club/individual/seriesOrganizer)
    },
    selectedView: {
      type: 'string', // Can be used for navigation/view state
      default: () => 'events', // Default view
    },
    lastAccess: {
      type: 'date',
      default: () => new Date(),
    },
  },
} as const;

export const kSchemeBaseUser = {
  ns: 'baseUser',
  version: 1,
  fields: {
    name: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
    },
    mobile: {
      type: 'string',
      required: true,
    },
    password: {
      // Will be hashed before storage
      type: 'string',
      required: true,
    },
    location: {
      type: 'string',
      required: true,
    },
    createdAt: {
      type: 'date',
      default: () => new Date(),
    },
    updatedAt: {
      type: 'date',
      default: () => new Date(),
    },
    isActive: {
      type: 'boolean',
      default: () => true,
    },
  },
} as const;

// Club Schema
export const kSchemeClub = {
  ns: 'club',
  version: 1,
  fields: {
    ...kSchemeBaseUser.fields,
    club_id: {
      type: 'string',
      required: true,
    },
    role: {
      type: 'string',
      required: true,
      // Values: 'admin', 'clubManager', 'raceOfficer', 'competitor'
    },
    events: {
      type: 'set', // Set of event IDs organized by this club
      default: () => new Set(),
    },
  },
} as const;

// Series Organizer Schema
export const kSchemeSeriesOrganizer = {
  ns: 'seriesOrganizer',
  version: 1,
  fields: {
    ...kSchemeBaseUser.fields,
    organization_id: {
      type: 'string',
      required: true,
    },
    role: {
      type: 'string',
      required: true,
      // Values: 'admin', 'manager', 'raceOfficer', 'competitor'
    },
    series: {
      type: 'set', // Set of series IDs managed by this organizer
      default: () => new Set(),
    },
  },
} as const;

// Individual User Schema
export const kSchemeIndividual = {
  ns: 'individual',
  version: 1,
  fields: {
    ...kSchemeBaseUser.fields,
    user_id: {
      type: 'string',
      required: true,
    },
    role: {
      type: 'string',
      required: true,
      default: () => 'competitor',
    },
    participatingEvents: {
      type: 'set', // Set of event IDs the user is participating in
      default: () => new Set(),
    },
    ownedBoats: {
      type: 'set', // Set of boat IDs owned by this user
      default: () => new Set(),
    },
  },
} as const;

// Boat Schema
export const kSchemeBoat = {
  ns: 'boat',
  version: 1,
  fields: {
    name: {
      type: 'string',
      required: true,
    },
    type: {
      type: 'string',
      required: true,
    },
    sail_number: {
      type: 'string',
      required: true,
    },
    owner_id: {
      type: 'string',
      required: true,
    },
    crew: {
      type: 'set', // Set of user IDs who are crew members
      default: () => new Set(),
    },
    rating: {
      type: 'string', // Optional rating
    },
    documents: {
      type: 'map', // Map of document IDs to document metadata
      default: () => new Map(),
    },
    participatingEvents: {
      type: 'set', // Set of event IDs this boat is registered for
      default: () => new Set(),
    },
    createdAt: {
      type: 'date',
      default: () => new Date(),
    },
    updatedAt: {
      type: 'date',
      default: () => new Date(),
    },
  },
} as const;

// Session Schema (for auth management)
export const kSchemeSession = {
  ns: 'session',
  version: 1,
  fields: {
    userId: {
      type: 'string',
      required: true,
    },
    userType: {
      type: 'string',
      required: true,
      // Values: 'club', 'seriesOrganizer', 'individual'
    },
    token: {
      type: 'string',
      required: true,
    },
    lastAccess: {
      type: 'date',
      default: () => new Date(),
    },
    expiresAt: {
      type: 'date',
      required: true,
    },
  },
} as const;

// Event Schema
export const kSchemeEvent = {
  ns: 'event',
  version: 1,
  fields: {
    name: {
      type: 'string',
      required: true,
    },
    location: {
      type: 'string',
      required: true,
    },
    start_date: {
      type: 'date',
      required: true,
    },
    end_date: {
      type: 'date',
      required: true,
    },
    organizer_id: {
      type: 'string',
      required: true,
    },
    status: {
      type: 'string',
      required: true,
      default: () => 'draft',
      // Values: 'draft', 'published', 'in_progress', 'completed', 'cancelled'
    },
    entry_fee: {
      type: 'number',
      required: true,
    },
    participants: {
      type: 'set', // Set of boat IDs registered for this event
      default: () => new Set(),
    },
    documents: {
      type: 'map', // Map of document IDs to document metadata
      default: () => new Map(),
    },
    series_id: {
      type: 'string', // Optional: if event is part of a series
    },
  },
} as const;

// Type definitions for TypeScript support
export type SchemeBaseUserType = typeof kSchemeBaseUser;
export type SchemeClubType = typeof kSchemeClub;
export type SchemeSeriesOrganizerType = typeof kSchemeSeriesOrganizer;
export type SchemeIndividualType = typeof kSchemeIndividual;
export type SchemeBoatType = typeof kSchemeBoat;
export type SchemeSessionType = typeof kSchemeSession;
export type SchemeEventType = typeof kSchemeEvent;
export type SchemeUISettingsType = typeof kSchemeUISettings;

export function registerSchemas(
  manager: SchemaManager = SchemaManager.default // Add default parameter
): void {
  const schemas = [
    kSchemeBaseUser,
    kSchemeClub,
    kSchemeSeriesOrganizer,
    kSchemeIndividual,
    kSchemeBoat,
    kSchemeSession,
    kSchemeEvent,
    kSchemeUISettings,
  ];

  if (!manager) {
    console.error('Schema manager is undefined');
    return;
  }

  schemas.forEach((schema) => {
    try {
      manager.register(schema);
    } catch (error) {
      console.error(`Failed to register schema ${schema.ns}:`, error);
    }
  });
}
