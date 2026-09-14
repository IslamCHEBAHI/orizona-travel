import { createHash, randomBytes } from "crypto";

export function createSecureReference(prefix = "BLT") {
  const now = new Date();
  const stamp = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const random = randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${stamp}-${random}`;
}

export function hashClientIp(ip: string) {
  const pepper = process.env.RATE_LIMIT_SECRET || process.env.NEXTAUTH_SECRET || "local-development";
  return createHash("sha256").update(`${pepper}:${ip}`).digest("hex");
}

export function normalizeText(value: FormDataEntryValue | null, maxLength: number) {
  return String(value ?? "").trim().slice(0, maxLength);
}

export function isValidEmail(value: string) {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPhone(value: string) {
  return /^[+()\d\s.-]{6,30}$/.test(value);
}
