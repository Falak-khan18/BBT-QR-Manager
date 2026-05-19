import { axiosClient } from "@/lib/axios/client";

import type { QrRecord } from "./types";

export async function listQR() {
  const response = await axiosClient.get<QrRecord[]>("/api/v1/qr");
  return response.data;
}
