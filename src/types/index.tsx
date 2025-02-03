import { ManagedItem } from '@goatdb/goatdb';
import {
  kSchemeEvent,
  kSchemeSailorProfile,
  SchemeEventType,
} from '../../schema.ts';

export type Event = ManagedItem<SchemeEventType>;
// Event related types
export interface EventCardProps {
  event: ManagedItem<typeof kSchemeEvent>;
  userId: string;
  onEventClick?: (eventId: string) => void;
}

export interface EventCreateProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

// Profile related types
export interface ProfileSetupProps {
  userId: string;
  onComplete?: () => void;
}

export interface ProfileFormData {
  type: 'individual' | 'club' | 'seriesOrganizer';
  role: string;
  name: string;
  mobile: string;
  location: string;
}

export type SailorProfile = ManagedItem<typeof kSchemeSailorProfile>;
