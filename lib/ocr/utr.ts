/**
 * Pure UTR/transaction-reference extraction from OCR text. No I/O — unit-safe.
 * Indian UPI references are commonly 12 digits (UTR/RRN); bank/txn ids vary.
 * The confidence returned decides whether the user must confirm the value.
 */

const LABELS =
  "(?:UTR(?:\\s*(?:No|Number))?|UPI\\s*(?:Ref(?:erence)?|Transaction)\\s*(?:No|ID|Number)?|" +
  "RRN|Ref(?:erence)?\\s*(?:No|Number|ID)?|Transaction\\s*(?:ID|No|Number)|Txn\\s*(?:ID|No)|Order\\s*(?:ID|No)|Google\\s*transaction\\s*ID)";

const LABELLED = new RegExp(
  `${LABELS}[\\s:#\\-–]*([A-Za-z0-9]{8,28})`,
  "i",
);
const TWELVE_DIGITS = /\b(\d{12})\b/;
const LONG_ALNUM = /\b([A-Za-z0-9]{12,22})\b/;

function clean(text: string): string {
  return text.replace(/\r/g, "\n");
}

export function extractRef(rawText: string): {
  ref: string | null;
  confidence: number;
} {
  const text = clean(rawText || "");
  if (!text.trim()) return { ref: null, confidence: 0 };

  // 1) Labelled reference — strongest signal.
  const labelled = text.match(LABELLED);
  if (labelled) {
    const value = labelled[1].toUpperCase();
    const isTwelveDigit = /^\d{12}$/.test(value);
    return { ref: value, confidence: isTwelveDigit ? 0.92 : 0.75 };
  }

  // 2) A bare 12-digit number (classic UTR) anywhere in the text.
  const twelve = text.match(TWELVE_DIGITS);
  if (twelve) {
    return { ref: twelve[1], confidence: 0.6 };
  }

  // 3) A long alphanumeric token — weak; must be confirmed.
  const long = text.match(LONG_ALNUM);
  if (long) {
    return { ref: long[1].toUpperCase(), confidence: 0.35 };
  }

  return { ref: null, confidence: 0 };
}

/** Confidence at/under this needs explicit user confirmation. */
export const LOW_CONFIDENCE = 0.7;
