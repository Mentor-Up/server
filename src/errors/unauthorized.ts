import CustomAPIError from './custom-api';

class UnauthorizedError extends CustomAPIError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}

export default UnauthorizedError;
