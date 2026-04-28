import { describe, it, expect, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { parseToken, registerToken, generateToken } from '../token';

const SECRET = 'test-secret';
const JWT_OPTS = {
  algorithm: 'HS256' as const,
  issuer: 'cfc-web',
  audience: 'cfc-web',
};

beforeEach(() => {
  process.env.SECRET = SECRET;
});

describe('generateToken', () => {
  it('returns a JWT string', () => {
    const token = generateToken({ userId: '1' });
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('embeds the provided params in the payload', () => {
    const token = generateToken({ userId: '42', role: 'admin' });
    const decoded = jwt.decode(token) as Record<string, unknown>;
    expect(decoded.userId).toBe('42');
    expect(decoded.role).toBe('admin');
  });

  it('throws when SECRET is missing', () => {
    delete process.env.SECRET;
    expect(() => generateToken({ userId: '1' })).toThrow(
      'Missing SECRET environment variable for JWT operations',
    );
  });
});

describe('parseToken', () => {
  it('returns cookie and sessionId from a valid token', () => {
    const token = jwt.sign(
      { cookie: 'rock-cookie', sessionId: 'sess-123' },
      SECRET,
      JWT_OPTS,
    );
    const result = parseToken(token);
    expect(result.cookie).toBe('rock-cookie');
    expect(result.sessionId).toBe('sess-123');
  });

  it('throws on an invalid token', () => {
    expect(() => parseToken('not.a.valid.token')).toThrow();
  });

  it('throws when SECRET is missing', () => {
    delete process.env.SECRET;
    const token = jwt.sign({ cookie: 'c', sessionId: 's' }, SECRET);
    expect(() => parseToken(token)).toThrow(
      'Missing SECRET environment variable for JWT operations',
    );
  });
});

describe('registerToken', () => {
  it('returns userToken, rockCookie, sessionId for a valid token', () => {
    const token = jwt.sign(
      { cookie: 'rock-cookie', sessionId: 'sess-abc' },
      SECRET,
      JWT_OPTS,
    );
    const result = registerToken(token);
    expect(result).toEqual({
      userToken: token,
      rockCookie: 'rock-cookie',
      sessionId: 'sess-abc',
    });
  });

  it('returns empty object for an expired token', () => {
    const token = jwt.sign({ cookie: 'c', sessionId: 's' }, SECRET, {
      ...JWT_OPTS,
      expiresIn: -1,
    });
    const result = registerToken(token);
    expect(result).toEqual({});
  });

  it('throws UNAUTHENTICATED error for a tampered token', () => {
    const token = 'invalid.token.here';
    expect(() => registerToken(token)).toThrow('Invalid token');
  });

  it('attaches UNAUTHENTICATED code and 401 status to the thrown error', () => {
    try {
      registerToken('bad.token.value');
    } catch (e) {
      const err = e as Error & { code?: string; http?: { status: number } };
      expect(err.code).toBe('UNAUTHENTICATED');
      expect(err.http?.status).toBe(401);
    }
  });
});
