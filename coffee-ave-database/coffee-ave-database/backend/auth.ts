import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

/* ------------------------------------------------------------------ */
/* Passwords (stored scrambled with scrypt, never as plain text)       */
/* ------------------------------------------------------------------ */

function scrypt(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, 64, (error, key) => (error ? reject(error) : resolve(key)));
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt);
  return `scrypt$${salt.toString('base64')}$${key.toString('base64')}`;
}

export async function verifyPassword(password: string, stored: string | null | undefined) {
  if (!stored) return false;
  const [scheme, saltText, keyText] = stored.split('$');
  if (scheme !== 'scrypt' || !saltText || !keyText) return false;
  const expected = Buffer.from(keyText, 'base64');
  const actual = await scrypt(password, Buffer.from(saltText, 'base64'));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function sameText(a: string, b: string) {
  const hashA = createHash('sha256').update(a).digest();
  const hashB = createHash('sha256').update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

/* ------------------------------------------------------------------ */
/* Sessions (a signed cookie, nothing stored on the server)            */
/* ------------------------------------------------------------------ */

export type Session = { role: 'member'; sub: string } | { role: 'admin'; sub: 'admin' };

const MEMBER_COOKIE = 'ca_session';
const ADMIN_COOKIE = 'ca_admin';
const MEMBER_DAYS = 14;
const ADMIN_HOURS = 8;

// Set SESSION_SECRET on Vercel. If you forget, ADMIN_PASSWORD is used instead.
// On your own computer a fixed development secret is used.
function secret() {
  const value = process.env.SESSION_SECRET?.trim() || process.env.ADMIN_PASSWORD?.trim();
  if (value) return value;
  if (process.env.VERCEL) return null;
  return 'coffee-ave-local-development-secret';
}

export function authConfigured() {
  return secret() !== null;
}

function sign(body: string, key: string) {
  return createHmac('sha256', key).update(body).digest('base64url');
}

function makeToken(session: Session, lifetimeMs: number) {
  const key = secret();
  if (!key) throw new Error('Set SESSION_SECRET (or ADMIN_PASSWORD) in Vercel to turn on sign in.');
  const body = Buffer.from(JSON.stringify({ ...session, exp: Date.now() + lifetimeMs })).toString('base64url');
  return `${body}.${sign(body, key)}`;
}

function readToken(token: string | undefined): Session | null {
  const key = secret();
  if (!token || !key) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature || !sameText(signature, sign(body, key))) return null;
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    if (data.role === 'member' && typeof data.sub === 'string') return { role: 'member', sub: data.sub };
    if (data.role === 'admin') return { role: 'admin', sub: 'admin' };
  } catch {
    // Not a valid token.
  }
  return null;
}

function cookies(request: Request) {
  const result: Record<string, string> = {};
  for (const part of (request.headers.cookie ?? '').split(';')) {
    const index = part.indexOf('=');
    if (index > 0) result[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
  }
  return result;
}

function cookieText(name: string, value: string, maxAgeSeconds: number) {
  const secure = process.env.VERCEL ? '; Secure' : '';
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secure}`;
}

export function startMemberSession(response: Response, userId: string) {
  const lifetime = MEMBER_DAYS * 24 * 3600 * 1000;
  response.append('Set-Cookie', cookieText(MEMBER_COOKIE, makeToken({ role: 'member', sub: userId }, lifetime), lifetime / 1000));
}

export function endMemberSession(response: Response) {
  response.append('Set-Cookie', cookieText(MEMBER_COOKIE, '', 0));
}

export function startAdminSession(response: Response) {
  const lifetime = ADMIN_HOURS * 3600 * 1000;
  response.append('Set-Cookie', cookieText(ADMIN_COOKIE, makeToken({ role: 'admin', sub: 'admin' }, lifetime), lifetime / 1000));
}

export function endAdminSession(response: Response) {
  response.append('Set-Cookie', cookieText(ADMIN_COOKIE, '', 0));
}

export function memberSession(request: Request) {
  const session = readToken(cookies(request)[MEMBER_COOKIE]);
  return session?.role === 'member' ? session : null;
}

export function adminSession(request: Request) {
  const session = readToken(cookies(request)[ADMIN_COOKIE]);
  return session?.role === 'admin' ? session : null;
}

export function requireMember(request: Request, response: Response, next: NextFunction) {
  const session = memberSession(request);
  if (!session) {
    response.status(401).json({ error: 'Please sign in first.' });
    return;
  }
  response.locals.userId = session.sub;
  next();
}

/* ------------------------------------------------------------------ */
/* Slow down repeated wrong passwords (best effort, per server)        */
/* ------------------------------------------------------------------ */

const attempts = new Map<string, { count: number; resetAt: number }>();

export function tooManyAttempts(key: string) {
  const entry = attempts.get(key);
  return !!entry && entry.resetAt > Date.now() && entry.count >= 8;
}

export function recordFailure(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) attempts.set(key, { count: 1, resetAt: now + 10 * 60 * 1000 });
  else entry.count += 1;
}

export function clearFailures(key: string) {
  attempts.delete(key);
}
