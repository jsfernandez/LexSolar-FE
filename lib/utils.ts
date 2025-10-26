import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safely parse JSON values that may be "undefined", "null", empty, or malformed
export function safeJSONParse<T = any>(value: string | null | undefined, fallback: T | null = null): T | null {
  if (!value) return fallback
  const trimmed = value.trim()
  if (trimmed === '' || trimmed === 'undefined') return fallback
  // allow literal 'null' to mean null
  if (trimmed === 'null') return null
  try {
    return JSON.parse(trimmed) as T
  } catch {
    return fallback
  }
}

// Convenience helper to read and parse a JSON value from localStorage on the client
export function getLocalStorageJSON<T = any>(key: string, fallback: T | null = null): T | null {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return safeJSONParse<T>(raw, fallback)
  } catch {
    return fallback
  }
}
