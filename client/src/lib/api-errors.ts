import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }
  const detail = error.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) =>
        typeof item === "object" && item && "msg" in item
          ? String((item as { msg: string }).msg)
          : JSON.stringify(item),
      )
      .join("; ");
  }
  if (detail && typeof detail === "object" && "message" in detail) {
    return String((detail as { message: string }).message);
  }
  if (error.message) return error.message;
  return fallback;
}
