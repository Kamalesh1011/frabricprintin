// Auth primitives for the Cloudflare Worker: signed session tokens and
// password hashing. Everything here uses WebCrypto (crypto.subtle), which is
// what the Workers runtime provides — node:crypto scrypt is not used.

const enc = new TextEncoder();

export type Role = 'admin' | 'user';

export interface SessionClaims {
  sub: string; // user id
  role: Role;
  email: string;
  exp: number; // unix seconds
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days

// PBKDF2 iterations. The Workers runtime caps PBKDF2 at 100k; 60k keeps
// login/register inside the free-plan CPU budget.
// The count is stored inside every hash, so it can be raised later without
// breaking existing passwords.
const PBKDF2_ITERATIONS = 60_000;

function b64urlEncode(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/') + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function toHex(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time comparison of two strings. */
export function safeEqual(a: string, b: string): boolean {
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  // Compare against itself when lengths differ so timing does not leak length.
  const len = Math.max(ab.length, bb.length);
  let diff = ab.length ^ bb.length;
  for (let i = 0; i < len; i++) diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify'
  ]);
}

export async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return toHex(sig);
}

export async function signSession(
  secret: string,
  claims: Omit<SessionClaims, 'exp'>,
  ttlSeconds = SESSION_TTL_SECONDS
): Promise<string> {
  const payload: SessionClaims = { ...claims, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const body = b64urlEncode(enc.encode(JSON.stringify(payload)));
  const key = await hmacKey(secret);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(body)));
  return `fp1.${body}.${b64urlEncode(sig)}`;
}

export async function verifySession(secret: string, token: string): Promise<SessionClaims | null> {
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'fp1') return null;
  const [, body, sig] = parts;
  try {
    const key = await hmacKey(secret);
    const ok = await crypto.subtle.verify('HMAC', key, b64urlDecode(sig), enc.encode(body));
    if (!ok) return null;
    const claims = JSON.parse(new TextDecoder().decode(b64urlDecode(body))) as SessionClaims;
    if (!claims.sub || !claims.role || typeof claims.exp !== 'number') return null;
    if (claims.exp < Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch {
    return null;
  }
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    baseKey,
    256
  );
  return new Uint8Array(bits);
}

/** Returns `pbkdf2$<iterations>$<salt b64url>$<hash b64url>`. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${b64urlEncode(salt)}$${b64urlEncode(hash)}`;
}

export async function verifyPassword(password: string, stored: string | null | undefined): Promise<boolean> {
  if (!stored) return false;
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = Number(parts[1]);
  if (!Number.isFinite(iterations) || iterations < 1000 || iterations > 100_000) return false;
  const salt = b64urlDecode(parts[2]);
  const expected = parts[3];
  const actual = b64urlEncode(await pbkdf2(password, salt, iterations));
  return safeEqual(actual, expected);
}

export function bearerToken(header: string | undefined | null): string {
  return (header || '').replace(/^Bearer\s+/i, '').trim();
}
