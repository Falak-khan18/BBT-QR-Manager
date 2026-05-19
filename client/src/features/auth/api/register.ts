import { axiosClient } from "@/lib/axios/client";

import type { UserPublic } from "./types";

export type RegisterPayload = {
  email: string;
  password: string;
};

export async function registerApi(payload: RegisterPayload) {
  const response = await axiosClient.post<UserPublic>(
    "/api/v1/auth/register",
    payload,
  );
  return response.data;
}
