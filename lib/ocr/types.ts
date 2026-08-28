/** Result of attempting to read a payment reference from a screenshot. */
export interface OcrResult {
  /** Best-guess transaction / UTR / reference id, or null if none found. */
  ref: string | null;
  /** 0–1 confidence. LOW confidence must be confirmed by the user. */
  confidence: number;
  /** Raw OCR text (stored for audit; never trusted as-is). */
  raw: string;
  /** Which provider produced this result. */
  provider: string;
}

/** A pluggable OCR backend. Keep providers free of app/UI concerns. */
export interface OcrProvider {
  name: string;
  /** Reads text from a PNG/JPEG/WebP image buffer. */
  readText(image: Buffer, mime: string): Promise<string>;
}
