// src/utils/typeGuards.ts
import { Dictionary } from 'https://jsr.io/@goatdb/goatdb/0.0.79/base/collections/dict.ts';
import { CoreValue } from 'https://jsr.io/@goatdb/goatdb/0.0.79/base/core-types/index.ts';

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isSet(value: unknown): value is Set<CoreValue> {
  return value instanceof Set;
}

export function isMap(value: unknown): value is Dictionary<string, CoreValue> {
  return value instanceof Map;
}

export function ensureString(value: unknown): string {
  if (value === undefined || value === null) return '';
  return String(value);
}

export function ensureNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  return 0;
}

export function ensureDate(value: unknown): Date {
  if (isDate(value)) return value;
  if (isString(value) || isNumber(value)) return new Date(value);
  return new Date();
}

export function ensureSet<T extends CoreValue>(value: unknown): Set<T> {
  if (isSet(value)) return value as Set<T>;
  return new Set<T>();
}
