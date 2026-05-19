import { axiosClient } from "@/lib/axios/client";

import type { UserPublic } from "./types";

export async function fetchMe() {
  const response = await axiosClient.get<UserPublic>("/api/v1/auth/me");
  return response.data;
}
