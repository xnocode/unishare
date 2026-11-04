import { createHash, randomBytes } from "crypto";

export const SESSION_COOKIE = "unishare_session";
export const SESSION_DAYS = 7;

export function hashPassword(password: string, salt?: string) {
  const s = salt ?? randomBytes(16).toString("hex");
  const hash = createHash("sha256").update(`${s}:${password}`).digest("hex");
  return { salt: s, hash };
}

export function verifyPassword(password: string, stored: string) {
  const [salt] = stored.split("$");
  if (!salt) return false;
  const { hash } = hashPassword(password, salt);
  return stored === `${salt}$${hash}`;
}

export function makeCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function nameFromEmail(email: string) {
  const local = email.split("@")[0].split(/[._-]/)[0] || "Student";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export { randomBytes };
