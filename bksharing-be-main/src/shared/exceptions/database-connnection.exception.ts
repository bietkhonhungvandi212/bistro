import { InternalServerErrorException } from '@nestjs/common';

export class DatabaseConnectionException extends InternalServerErrorException {
  constructor(message: string) {
    const errorMessage = `Database connection error: ${message}`;
    super(errorMessage);
    super.name = DatabaseConnectionException.name;
    super.message = errorMessage;
  }
}
