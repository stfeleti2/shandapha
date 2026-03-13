export function toErrorResponse(error: Error) {
  return { message: error.message };
}
