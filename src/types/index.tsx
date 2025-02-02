import { ManagedItem } from '@goatdb/goatdb';
import { SchemeEventType, SchemeSailorProfileType } from '../../schema.ts';

export type Event = ManagedItem<SchemeEventType>;
export type SailorProfile = ManagedItem<SchemeSailorProfileType>;

export interface EventCardProps {
  event: Event;
  userId: string;
  onEventClick?: (eventId: string) => void;
}

export interface EventListProps {
  userId: string;
}

export interface EventCardProps {
  event: Event;
  userId: string;
  onEventClick?: (eventId: string) => void;
}
