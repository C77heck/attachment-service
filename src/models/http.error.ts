import { ERROR_MESSAGES } from '../libs/constants';

export class HttpError extends Error {
  public statusCode;

  public constructor(message?: string, statusCode?: number) {
    super();
    this.message = message || ERROR_MESSAGES.GENERIC;
    this.statusCode = statusCode || 500;
  }
}
