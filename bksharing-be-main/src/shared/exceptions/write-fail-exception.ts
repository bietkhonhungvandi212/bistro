import { ConflictException } from '@nestjs/common';

export class WriteFailedException extends ConflictException {
  constructor(action: 'create' | 'update' | 'delete', errorMessage: string) {
    const message = `Can't perform ${action} because ${errorMessage}`;
    super(message);
    super.name = WriteFailedException.name;
    super.message = message;
  }
}
