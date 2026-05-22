import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCompactValue(value?: string | number | null) {
  if (!value) return null;
  const stringValue = String(value).trim();
  return stringValue.length > 0 ? stringValue : null;
}

export function formatUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function createInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function sanitizeUsername(username: string) {
  return username.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
}

export function isValidUsername(username: string) {
  return /^[a-z0-9_]{3,20}$/.test(username);
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}
