import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function assertNever(
  value: never,
  message: string = "Unhandled case"
): never {
  throw new Error(`${message}: ${JSON.stringify(value)}`);
}

export const iife = <T>(fn: () => T): T => fn();
