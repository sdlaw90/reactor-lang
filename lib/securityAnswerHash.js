import crypto from "crypto";

// Server-only scrypt hashing for security-question answers (#79). Answers
// are credentials and are treated exactly like passwords: per-answer random
// salt, memory-hard KDF, constant-time comparison. Zero new dependencies —
// node:crypto ships scrypt.
//
// Stored format:  scrypt$<N>$<saltHex>$<hashHex>
// N is recorded per-hash so the cost can be raised later without breaking
// existing rows (old rows keep verifying at their recorded cost).

const SCRYPT_N = 16384; // 2^14 — interactive-login cost, fine for a reset flow
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 32;
const SALT_LEN = 16;

export function hashAnswer(normalizedAnswer) {
  const salt = crypto.randomBytes(SALT_LEN);
  const hash = crypto.scryptSync(normalizedAnswer, salt, KEY_LEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return `scrypt$${SCRYPT_N}$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyAnswer(normalizedAnswer, stored) {
  try {
    const [scheme, nStr, saltHex, hashHex] = String(stored || "").split("$");
    if (scheme !== "scrypt") return false;
    const N = parseInt(nStr, 10);
    if (!Number.isInteger(N) || N < 2) return false;
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const actual = crypto.scryptSync(normalizedAnswer, salt, expected.length, {
      N,
      r: SCRYPT_R,
      p: SCRYPT_P,
    });
    return crypto.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

// One-time reset tokens: the raw token goes to the client once; only its
// sha256 lands in password_reset_tokens.token_hash.
export function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashResetToken(rawToken) {
  return crypto.createHash("sha256").update(String(rawToken)).digest("hex");
}
