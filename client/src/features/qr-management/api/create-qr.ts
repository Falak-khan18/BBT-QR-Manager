import { axiosClient } from "@/lib/axios/client";

import type { CreateQRPayload, QrRecord } from "./types";

export async function createQR(payload: CreateQRPayload) {
  const response = await axiosClient.post<QrRecord>("/api/v1/qr", payload);
  return response.data;
}
