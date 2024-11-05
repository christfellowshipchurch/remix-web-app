import jwt from "jsonwebtoken";

export const secret = process.env.SECRET || "ASea$2gadj#asd0";

export function parseToken(token: string) {
  return jwt.verify(token, secret) as { cookie: string; sessionId: string };
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
    const error = new Error("Invalid token");
    (error as any).code = "UNAUTHENTICATED";
    (error as any).http = { status: 401 };
    throw error;
  }
}

export function generateToken(params: Record<string, any>) {
  return jwt.sign({ ...params }, secret, { expiresIn: "400d" });
}
