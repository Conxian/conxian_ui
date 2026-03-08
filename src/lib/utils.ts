import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats an on-chain amount (integer string) to a human-readable decimal string.
 * @param amount - The raw amount string (e.g., "1500000")
 * @param decimals - The number of decimals (default: 6)
 * @returns A formatted string (e.g., "1.5")
 */
export function formatAmount(amount: string, decimals = 6): string {
  if (!amount || amount === "0") return "0";
  try {
    const padded = amount.padStart(decimals + 1, "0");
    const integerPart = padded.slice(0, -decimals);
    let fractionalPart = padded.slice(-decimals);

    // Trim trailing zeros from fractional part
    fractionalPart = fractionalPart.replace(/0+$/, "");

    return fractionalPart.length > 0
      ? `${integerPart}.${fractionalPart}`
      : integerPart;
  } catch {
    return "0";
  }
}

/**
 * Parses a human-readable decimal string to an on-chain integer string.
 * @param amount - The decimal string (e.g., "1.5")
 * @param decimals - The number of decimals (default: 6)
 * @returns An integer string (e.g., "1500000")
 */
export function parseAmount(amount: string, decimals = 6): string {
  if (!amount || amount === "0") return "0";
  try {
    const [integerPart, fractionalPart = ""] = amount.split(".");
    const paddedFractional = fractionalPart
      .substring(0, decimals)
      .padEnd(decimals, "0");
    const result = BigInt(integerPart + paddedFractional).toString();
    return result;
  } catch {
    return "0";
  }
}

/**
 * Truncates a Stacks address or transaction ID for display.
 * @param str - The string to truncate
 * @param startChars - Number of characters to keep at the start (default: 6)
 * @param endChars - Number of characters to keep at the end (default: 4)
 * @returns The truncated string
 */
export function truncate(str: string, startChars = 6, endChars = 4): string {
  if (!str) return "";
  if (str.length <= startChars + endChars) return str;
  return `${str.substring(0, startChars)}...${str.substring(str.length - endChars)}`;
}
