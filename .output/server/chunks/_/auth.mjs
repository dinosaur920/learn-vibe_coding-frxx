import { PrismaClient } from '@prisma/client';
import { g as getRequestHeader, f as getCookie, h as setCookie } from './nitro.mjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

var _a;
const prisma = (_a = globalThis.__prismaClient) != null ? _a : new PrismaClient({
  log: ["error"]
});

function createErrorResponse(code, message) {
  return {
    success: false,
    code,
    message
  };
}
function createSuccessResponse(data) {
  return {
    success: true,
    data
  };
}

const authCookieName = "auth_token";
const jwtSecret = process.env.JWT_SECRET || "dev-secret";
const jwtExpiresIn = "7d";
const bcryptSaltRounds = 12;
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(bcryptSaltRounds);
  return bcrypt.hash(password, salt);
}
function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
function signAuthToken(userId) {
  const payload = { userId };
  return jwt.sign(payload, jwtSecret, { algorithm: "HS256", expiresIn: jwtExpiresIn });
}
function verifyAuthToken(token) {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch {
    return null;
  }
}
function getTokenFromRequest(event) {
  const authHeader = getRequestHeader(event, "authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }
  const cookieToken = getCookie(event, authCookieName);
  if (cookieToken && typeof cookieToken === "string" && cookieToken.length > 0) {
    return cookieToken;
  }
  return null;
}
function setAuthCookie(event, token) {
  setCookie(event, authCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export { createSuccessResponse as a, verifyPassword as b, createErrorResponse as c, setAuthCookie as d, getTokenFromRequest as g, hashPassword as h, prisma as p, signAuthToken as s, verifyAuthToken as v };
//# sourceMappingURL=auth.mjs.map
