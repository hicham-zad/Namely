/**
 * Generate Apple Sign-In secret key (JWT) for Supabase.
 * 
 * HOW TO USE:
 * 1. Fill in the 4 variables below
 * 2. Run: node scripts/generate-apple-secret.js
 * 3. Copy the output and paste into Supabase → Auth → Providers → Apple → Secret Key
 * 
 * WHERE TO FIND EACH VALUE:
 * - TEAM_ID:      Apple Developer Console → top-right corner (10 chars, e.g. "AB12CD34EF")
 * - KEY_ID:       Developer Console → Certificates, Identifiers & Profiles → Keys → click your key
 * - CLIENT_ID:    The Services ID identifier you created (e.g. "com.nametogether.web")
 * - PRIVATE_KEY:  Contents of the .p8 file you downloaded — paste the whole thing including
 *                 -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----
 */

const crypto = require("crypto");

// ── FILL THESE IN ─────────────────────────────────────────────────────────────
const TEAM_ID = "2FT8J3SX2G";
const KEY_ID = "BT8B342GFJ";
const CLIENT_ID = "com.nametogether.web";
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgQvCH8dWx7MMbj7Ce
9m25K9wH+cWbTc5FlAyWRBLpJeygCgYIKoZIzj0DAQehRANCAATNpQkULeHMyw06
TlRHdAce4PqKh6AfZiMb0rc+2t64Efa/Sn9gmDEJerovnC+IIa3/XjpKJR5KokSH
oNzPOvgS
-----END PRIVATE KEY-----`;
// ─────────────────────────────────────────────────────────────────────────────

function base64url(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

const header = base64url(JSON.stringify({ alg: "ES256", kid: KEY_ID }));

const now = Math.floor(Date.now() / 1000);
const payload = base64url(
  JSON.stringify({
    iss: TEAM_ID,
    iat: now,
    exp: now + 15552000, // 6 months (Apple max)
    aud: "https://appleid.apple.com",
    sub: CLIENT_ID,
  })
);

const data = `${header}.${payload}`;

const sign = crypto.createSign("SHA256");
sign.update(data);
sign.end();
const signature = sign
  .sign({ key: PRIVATE_KEY, dsaEncoding: "ieee-p1363" })
  .toString("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=/g, "");

const jwt = `${header}.${payload}.${signature}`;

console.log("\n✅ Apple Secret Key JWT (paste into Supabase):\n");
console.log(jwt);
console.log("\n⚠️  This key expires in 6 months. Re-run this script to renew it.\n");
