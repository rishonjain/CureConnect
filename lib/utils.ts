import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function formatTime(timeString: string) {
  // Handle time strings like "3:00 PM"
  return timeString
}

// Generate a unique ID
export function generateId(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}
