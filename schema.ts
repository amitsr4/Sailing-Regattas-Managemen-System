import { SchemaManager } from '@goatdb/goatdb';

// UI Settings Schema
export const kSchemeUISettings = {
  ns: 'uiSettings',
  version: 1,
  fields: {
    selectedView: {
      type: 'string',
      default: () => 'events',
    },
    lastAccess: {
      type: 'date',
      default: () => new Date(),
    },
  },
} as const;

// Sailor Profile Schema (extends built-in user data)
export const kSchemeSailorProfile = {
  ns: 'sailorProfile',
  version: 1,
  fields: {
    userId: {
      // References the built-in user
      type: 'string',
      required: true,
    },
    type: {
      // 'club', 'individual', or 'seriesOrganizer'
      type: 'string',
      required: true,
    },
    role: {
      type: 'string',
      required: true,
      default: () => 'competitor',
    },
    name: {
      type: 'string',
      required: true,
    },
    mobile: {
      type: 'string',
      required: true,
    },
    location: {
      type: 'string',
      required: true,
    },
    participatingEvents: {
      type: 'set', // Set of event IDs
      default: () => new Set(),
    },
    ownedBoats: {
      type: 'set', // Set of boat IDs
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
      type: 'set', // Set of event IDs
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
    },
    entry_fee: {
      type: 'number',
      required: true,
    },
    participants: {
      type: 'set', // Set of boat IDs
      default: () => new Set(),
    },
    documents: {
      type: 'map', // Map of document IDs to document metadata
      default: () => new Map(),
    },
    series_id: {
      type: 'string', // Optional: if event is part of a series
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

export type SchemeUISettingsType = typeof kSchemeUISettings;
export type SchemeSailorProfileType = typeof kSchemeSailorProfile;
export type SchemeBoatType = typeof kSchemeBoat;
export type SchemeEventType = typeof kSchemeEvent;

export function registerSchemas(
  manager: SchemaManager = SchemaManager.default
): void {
  const schemas = [
    kSchemeUISettings,
    kSchemeSailorProfile,
    kSchemeBoat,
    kSchemeEvent,
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
