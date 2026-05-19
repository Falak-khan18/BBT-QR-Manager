import { axiosClient } from "@/lib/axios/client";

import type { AuthTokenResponse } from "./types";

export type LoginPayload = {
  email: string;
  password: string;
};

export async function loginApi(payload: LoginPayload) {
  const response = await axiosClient.post<AuthTokenResponse>(
    "/api/v1/auth/login",
    payload,
  );
  return response.data;
}
