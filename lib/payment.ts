import "server-only";
import QRCode from "qrcode";

/** Builds a standard UPI intent URI. Amount is given in paise. */
export function buildUpiUri(amountPaise: number, note: string): string {
  const pa = process.env.NEXT_PUBLIC_UPI_ID ?? "wissendrust@examplebank";
  const pn = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME ?? "Wissendrust 27";
  const am = (amountPaise / 100).toFixed(2);
  const params = new URLSearchParams({
    pa,
    pn,
    am,
    cu: "INR",
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}

/** Renders the UPI URI to a QR code data URL (no external services). */
export async function upiQrDataUrl(
  amountPaise: number,
  note: string,
): Promise<string> {
  const uri = buildUpiUri(amountPaise, note);
  return QRCode.toDataURL(uri, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 320,
    color: { dark: "#0b2528", light: "#ffffff" },
  });
}
