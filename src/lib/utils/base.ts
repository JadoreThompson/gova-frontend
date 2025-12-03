import type { HTTPValidationError } from "@/openapi";

export function handleApi<T>(
  response: { status: number; data: T; headers: Headers } | { status: number; data: HTTPValidationError; headers: Headers }
): T {
  if (response.status % 200 < 100) {
    return response.data as T;
  }
  throw response.data;
}
