import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const normalizeList = (data) => (Array.isArray(data) ? data : data?.data ?? []);
