export interface CustomErrorType {
  code: number;
  error: string;
  message?: string;
  response: { message: string };
}

export function isApiError(x: unknown): x is CustomErrorType {
  if (x && typeof x === 'object' && 'response' in x) {
    return true;
  }
  return false;
}
