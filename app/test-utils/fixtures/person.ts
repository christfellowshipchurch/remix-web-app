import type { User } from '~/providers/auth-provider';

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: '1',
    fullName: 'Test User',
    email: 'test@example.com',
    phoneNumber: '5551234567',
    guid: 'abc12345-1234-1234-1234-123456789abc',
    gender: 'Male',
    birthDate: '1990-01-01',
    photo: '/test-photo.jpg',
    ...overrides,
  };
}
