import { SignJWT, jwtVerify } from "jose";

// Edge-safe session helpers (no bcrypt/node-only deps) so this can be
// imported from middleware as well as regular API routes.

export const SESSION_COOKIE_NAME = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, in seconds

export type UserRole = "user" | "admin";

export interface SessionPayload {
  sub: string;
  username: string;
  role: UserRole;
}

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET 환경변수가 설정되지 않았습니다.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ username: payload.username, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.sub !== "string" ||
      typeof payload.username !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }
    return { sub: payload.sub, username: payload.username, role: payload.role as UserRole };
  } catch {
    return null;
  }
}
