import { ConflictException } from '@nestjs/common';

export class AssetFileNotExisted extends ConflictException {
  constructor(fileId?: number | number[]) {
    const message = `File id(s) = ${typeof fileId === 'number' ? fileId : fileId.join(', ')} doesn't exist`;
    super(message);
    super.name = AssetFileNotExisted.name;
    super.message = message;
  }
}
