import jwt from 'jsonwebtoken';

const JWT_ISSUER = 'cfc-web';
const JWT_AUDIENCE = 'cfc-web';

export function parseToken(token: string) {
  const secret = process.env.SECRET;

  if (!secret) {
    throw new Error('Missing SECRET environment variable for JWT operations');
  }

  return jwt.verify(token, secret, {
    algorithms: ['HS256'],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  }) as { cookie: string; sessionId: string };
}

export function registerToken(token: string) {
  try {
    const { cookie, sessionId } = parseToken(token);

    return {
      userToken: token,
      rockCookie: cookie,
      sessionId,
    };
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return {};
    }
    const error = new Error('Invalid token');
    (error as Error & { code?: string; http?: { status: number } }).code =
      'UNAUTHENTICATED';
    (error as Error & { code?: string; http?: { status: number } }).http = {
      status: 401,
    };
    throw error;
  }
}

export function generateToken(params: Record<string, unknown>) {
  const secret = process.env.SECRET;

  if (!secret) {
    throw new Error('Missing SECRET environment variable for JWT operations');
  }

  // Expiry is set to 24h (reduced from 400d for security).
  // If login is re-implemented, consider adding a refresh token flow so users
  // aren't forced to re-authenticate daily. Short-lived access tokens (24h) +
  // long-lived refresh tokens (30d) in an httpOnly cookie is the recommended pattern.
  return jwt.sign({ ...params }, secret, {
    algorithm: 'HS256',
    expiresIn: '24h',
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
}
