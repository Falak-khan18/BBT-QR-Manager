import { axiosClient } from "@/lib/axios/client";

import type { QrRecord } from "./types";

export async function getQR(id: string) {
  const response = await axiosClient.get<QrRecord>(`/api/v1/qr/${id}`);
  return response.data;
}
