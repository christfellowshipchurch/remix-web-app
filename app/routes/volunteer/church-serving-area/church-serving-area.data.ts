import type { ChurchRole } from './types';

/**
 * Placeholder role options used until Rock data is wired.
 * Replace with a Rock fetch once the correct DefinedType or Group structure is confirmed.
 */
export const STATIC_CHURCH_ROLES: ChurchRole[] = [
  {
    id: 'first-impressions',
    title: 'First Impressions',
    description: 'Say hello and help people find their way',
    expandedDescription:
      "You help set the tone for everyone who walks through the doors. Whether it's holding a door, answering a quick question, or simply smiling, your presence makes people feel expected and welcomed.",
  },
  {
    id: 'usher',
    title: 'Usher',
    description:
      'Help people find seats and keep the flow smooth during services.',
    expandedDescription:
      "Ushers guide guests to available seating, assist with communion, and help manage the movement of people during services. You're the steady presence that keeps things running behind the scenes.",
  },
  {
    id: 'host-team',
    title: 'Host Team',
    description:
      'Serve coffee, snacks, or welcome stations before and after services.',
    expandedDescription:
      'The Host Team creates a warm environment in the lobby and common areas. You might be pouring coffee, chatting with a first-time guest, or setting up for post-service connection time.',
  },
];
