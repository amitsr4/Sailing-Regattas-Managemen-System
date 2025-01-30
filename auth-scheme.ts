export const kSchemeAuth = {
  ns: 'auth',
  version: 1,
  fields: {
    userId: {
      type: 'string',
      required: true,
    },
    userType: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
    },
    hashedPassword: {
      type: 'string',
      required: true,
    },
    lastLogin: {
      type: 'date',
      default: () => new Date(),
    },
    sessionToken: {
      type: 'string',
    },
    isActive: {
      type: 'boolean',
      default: () => true,
    },
  },
} as const;
