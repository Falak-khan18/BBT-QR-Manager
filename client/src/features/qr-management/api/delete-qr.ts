import { axiosClient } from "@/lib/axios/client";

export async function deleteQR(id: string) {
  await axiosClient.delete(`/api/v1/qr/${id}`);
}
