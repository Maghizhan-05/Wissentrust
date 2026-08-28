import "server-only";
import type { OcrProvider } from "../types";

/**
 * OCR.space adapter. Free-tier friendly. The API key stays server-side.
 * Docs: https://ocr.space/ocrapi
 */
export function ocrSpaceProvider(): OcrProvider {
  return {
    name: "ocrspace",
    async readText(image: Buffer, mime: string): Promise<string> {
      const apiKey = process.env.OCR_API_KEY;
      if (!apiKey) throw new Error("OCR_API_KEY is not set");

      const base64 = `data:${mime};base64,${image.toString("base64")}`;
      const form = new FormData();
      form.append("base64Image", base64);
      form.append("language", "eng");
      form.append("isTable", "true");
      form.append("OCREngine", "2");
      form.append("scale", "true");

      const res = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        headers: { apikey: apiKey },
        body: form,
      });

      if (!res.ok) {
        throw new Error(`OCR provider HTTP ${res.status}`);
      }
      const json = (await res.json()) as {
        IsErroredOnProcessing?: boolean;
        ErrorMessage?: string | string[];
        ParsedResults?: { ParsedText?: string }[];
      };
      if (json.IsErroredOnProcessing) {
        const msg = Array.isArray(json.ErrorMessage)
          ? json.ErrorMessage.join("; ")
          : json.ErrorMessage;
        throw new Error(msg || "OCR processing error");
      }
      return json.ParsedResults?.map((r) => r.ParsedText ?? "").join("\n") ?? "";
    },
  };
}
