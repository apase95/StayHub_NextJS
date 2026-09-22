export type ApiResponse<T = null> = {
  success: boolean;
  message: string;
  data: T | null;
  errorCode: string | null;
};

export function ok<T>(data: T, message = "Thành công"): ApiResponse<T> {
  return { success: true, message, data, errorCode: null };
}

export function fail(message: string, errorCode: string | null = null): ApiResponse<null> {
  return { success: false, message, data: null, errorCode };
}
