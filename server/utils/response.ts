export type ErrorResponse = {
  success: false
  code: string
  message: string
}

export type SuccessResponse<T> = {
  success: true
  data: T
}

export function createErrorResponse(code: string, message: string): ErrorResponse {
  return {
    success: false,
    code,
    message
  }
}

export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data
  }
}

