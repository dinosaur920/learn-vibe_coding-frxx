import type { H3Event } from "h3"
import { getCookie, getRequestHeader, setCookie } from "h3"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const authCookieName = "auth_token"
const jwtSecret = process.env.JWT_SECRET || "dev-secret"
const jwtExpiresIn = "7d"
const bcryptSaltRounds = 12

interface AuthTokenPayload {
  userId: number
  exp?: number
  iat?: number
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(bcryptSaltRounds)
  return bcrypt.hash(password, salt)
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function signAuthToken(userId: number) {
  const payload: AuthTokenPayload = { userId }
  return jwt.sign(payload, jwtSecret, { algorithm: "HS256", expiresIn: jwtExpiresIn })
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthTokenPayload
    return decoded
  } catch {
    return null
  }
}

export function getTokenFromRequest(event: H3Event): string | null {
  const authHeader = getRequestHeader(event, "authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length)
  }
  const cookieToken = getCookie(event, authCookieName)
  if (cookieToken && typeof cookieToken === "string" && cookieToken.length > 0) {
    return cookieToken
  }
  return null
}

export function setAuthCookie(event: H3Event, token: string) {
  setCookie(event, authCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  })
}

export function clearAuthCookie(event: H3Event) {
  setCookie(event, authCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  })
}

