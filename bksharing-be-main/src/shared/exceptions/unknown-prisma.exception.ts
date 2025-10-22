import { ConflictException } from '@nestjs/common';

export class UnknownPrismaException extends ConflictException {
  constructor(message: string) {
    const errorMessage = `An unknown error occurred with Prisma: ${message}`;
    super(errorMessage);
    super.name = UnknownPrismaException.name;
    super.message = errorMessage;
  }
}
