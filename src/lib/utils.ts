import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Helper function to ensure exhaustive type checking in switch statements
 * @param value - The value that should be of type never
 * @param message - Optional message to throw if the function is called
 */
export function assertNever(value: never, message: string = "Unhandled case"): never {
  throw new Error(`${message}: ${JSON.stringify(value)}`)
}
