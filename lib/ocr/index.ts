import "server-only";
import type { OcrProvider, OcrResult } from "./types";
import { extractRef } from "./utr";
import { ocrSpaceProvider } from "./providers/ocrspace";

/**
 * paymentVerificationService — the single seam the app talks to for OCR.
 * Swap providers here (Google Vision, Textract, Tesseract, …) without touching
 * callers. Extraction never auto-verifies a payment; it only proposes a
 * reference for the user to confirm and the admin to review.
 */
function getProvider(): OcrProvider | null {
  const which = (process.env.OCR_PROVIDER ?? "ocrspace").toLowerCase();
  switch (which) {
    case "ocrspace":
      return process.env.OCR_API_KEY ? ocrSpaceProvider() : null;
    // case "vision":  return googleVisionProvider();
    // case "textract": return textractProvider();
    default:
      return null;
  }
}

export const paymentVerificationService = {
  /**
   * Attempts to extract a transaction reference from a screenshot.
   * Degrades gracefully: if no provider is configured or OCR fails, returns a
   * null ref so the user can type the reference in manually.
   */
  async extract(image: Buffer, mime: string): Promise<OcrResult> {
    const provider = getProvider();
    if (!provider) {
      return { ref: null, confidence: 0, raw: "", provider: "none" };
    }
    try {
      const raw = await provider.readText(image, mime);
      const { ref, confidence } = extractRef(raw);
      return { ref, confidence, raw, provider: provider.name };
    } catch (err) {
      return {
        ref: null,
        confidence: 0,
        raw: err instanceof Error ? `OCR_ERROR: ${err.message}` : "OCR_ERROR",
        provider: provider.name,
      };
    }
  },
};

export { LOW_CONFIDENCE } from "./utr";
