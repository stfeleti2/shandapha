export class PlatformHttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "PlatformHttpError";
  }
}

export function toErrorResponse(error: unknown, requestId: string) {
  if (error instanceof PlatformHttpError) {
    return {
      status: error.status,
      body: {
        error: error.name,
        message: error.message,
        requestId,
      },
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      body: {
        error: "InternalServerError",
        message: error.message,
        requestId,
      },
    };
  }

  return {
    status: 500,
    body: {
      error: "InternalServerError",
      message: "Unknown platform-api failure.",
      requestId,
    },
  };
}
