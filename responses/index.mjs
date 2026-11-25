export const sendResponse = (statusCode, data) => {
  if (statusCode === 204) return { statusCode }; // 204 = no body

  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
};

export const sendError = (statusCode, message) =>
  sendResponse(statusCode, { error: message });

// throw new HttpError(404, 'Post not found') anywhere -> errorHandler sends it as 404
export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}