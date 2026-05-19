"use client";

import { QRCodeSVG } from "qrcode.react";

/** Match server + demo: same level/size/margin = identical pixels for the same encoded string. */
const STABLE_LEVEL = "M" as const;
const STABLE_MARGIN = false;

type Props = {
  /** Must be the stable redirect URL (`…/r/{short_code}`), never the raw campaign URL. */
  value: string;
  size?: number;
  className?: string;
};

/**
 * Preview QR used in dashboard demos. Encodes **only** `redirect_url` from the API.
 * Editing `destination_url` in the DB must **not** change `value` — that is the Section 03 hard requirement.
 */
export function QrCodePreview({ value, size = 180, className }: Props) {
  return (
    <div
      className={`inline-flex rounded-md border bg-white p-2 ${className ?? ""}`}
    >
      <QRCodeSVG
        value={value}
        size={size}
        level={STABLE_LEVEL}
        includeMargin={STABLE_MARGIN}
      />
    </div>
  );
}
