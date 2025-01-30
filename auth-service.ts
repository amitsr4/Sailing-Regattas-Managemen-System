import { useDB, useItem } from '@goatdb/goatdb/react';
import { kSchemeAuth } from './auth-scheme.ts';
import {
  kSchemeClub,
  kSchemeIndividual,
  kSchemeSeriesOrganizer,
} from './schema.ts';

export class AuthService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  async login(email: string, password: string) {
    // In a real application, use proper password hashing
    const hashedPassword = await this.hashPassword(password);

    const authQuery = this.db.query({
      schema: kSchemeAuth,
      source: '/data/auth',
      predicate: (item: { get: (arg0: string) => string | boolean }) =>
        item.get('email') === email &&
        item.get('hashedPassword') === hashedPassword &&
        item.get('isActive') === true,
    });

    const results = authQuery.results();
    if (results.length === 0) {
      throw new Error('Invalid credentials');
    }

    const authRecord = results[0];
    const sessionToken = this.generateSessionToken();

    // Update last login and session token
    authRecord.set('lastLogin', new Date());
    authRecord.set('sessionToken', sessionToken);

    return {
      userId: authRecord.get('userId'),
      userType: authRecord.get('userType'),
      sessionToken,
    };
  }

  async register(userData: { email: any }, userType: string, password: string) {
    const userId = crypto.randomUUID();
    const hashedPassword = await this.hashPassword(password);

    // Create auth record
    await this.db.load(`/data/auth/${userId}`, kSchemeAuth, {
      userId,
      userType,
      email: userData.email,
      hashedPassword,
    });

    // Create user profile based on type
    const userPath = `/data/users/${userType}/${userId}`;
    const userSchema = this.getSchemaForUserType(userType);

    await this.db.load(userPath, userSchema, {
      ...userData,
      [`${userType}_id`]: userId,
    });

    return userId;
  }

  async logout(sessionToken: string) {
    const authQuery = this.db.query({
      schema: kSchemeAuth,
      source: '/data/auth',
      predicate: (item: { get: (arg0: string) => string }) =>
        item.get('sessionToken') === sessionToken,
    });

    const results = authQuery.results();
    if (results.length > 0) {
      const authRecord = results[0];
      authRecord.set('sessionToken', null);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    // In a real application, use a proper password hashing library
    // This is just for demonstration
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private generateSessionToken(): string {
    return crypto.randomUUID();
  }

  private getSchemaForUserType(type: string) {
    switch (type) {
      case 'club':
        return kSchemeClub;
      case 'seriesOrganizer':
        return kSchemeSeriesOrganizer;
      case 'individual':
        return kSchemeIndividual;
      default:
        throw new Error('Invalid user type');
    }
  }
}
