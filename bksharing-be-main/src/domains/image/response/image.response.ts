import { Prisma } from '@prisma/client';

import { StorageDTO } from 'src/services/storage/dto/storage.dto';
import { ImageVersionRESP } from './image-version.response';

export class ImageRESP {
  fileName: string;
  fileId: number;
  fileSize: number | null;
  originalUrl: string;
  versions: ImageVersionRESP[];

  static fromEntity(e: Prisma.FileGetPayload<unknown>, storage: StorageDTO, versions: ImageVersionRESP[]): ImageRESP {
    return {
      fileId: e.id,
      fileName: e.filename,
      fileSize: storage.size,
      originalUrl: storage.url,
      versions,
    };
  }
}
