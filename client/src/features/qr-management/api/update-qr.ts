import { axiosClient } from "@/lib/axios/client";

import type { QrRecord, UpdateQRPayload } from "./types";

export async function updateQR(id: string, payload: UpdateQRPayload) {
  const response = await axiosClient.patch<QrRecord>(
    `/api/v1/qr/${id}`,
    payload,
  );
  return response.data;
}
