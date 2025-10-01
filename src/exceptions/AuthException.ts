import { BaseException } from './BaseException';

export class AuthException extends BaseException {
  constructor(
    message: string = 'Authentication failed',
    code: string = 'AUTH_ERROR',
    context?: Record<string, any>
  ) {
    super(message, code, context);
  }
}

export class PermissionException extends AuthException {
  constructor(
    message: string = 'Insufficient permissions',
    context?: Record<string, any>
  ) {
    super(message, 'PERMISSION_DENIED', context);
  }
}

export class TokenExpiredException extends AuthException {
  constructor(context?: Record<string, any>) {
    super('Authentication token has expired', 'TOKEN_EXPIRED', context);
  }
}
