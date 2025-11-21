import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  // Prefer explicit Vite env variable, fall back to current origin
  return import.meta.env.VITE_BASE_URL || window.location?.origin || "";
}