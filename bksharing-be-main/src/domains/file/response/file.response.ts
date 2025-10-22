import { Prisma } from '@prisma/client';
import { StorageDTO } from 'src/services/storage/dto/storage.dto';
import { parseEpoch } from 'src/shared/parsers/common.parser';
import { orNull } from 'src/shared/parsers/io.parser';

export class FileRESP {
  fileId: number;
  fileName: string;
  fileSize: number | null;
  url: string;
  createdAt: number;
  registrant: { id: number; email: string };

  static querySelect(): Prisma.FileSelect {
    return {
      id: true,
      filename: true,
      publicId: true,
      size: true,
      createdAt: true,
      Registrant: { select: { id: true, email: true } },
    };
  }

  static fromEntity(e: Prisma.FileGetPayload<{ include: { Registrant: true } }>, storage: StorageDTO): FileRESP {
    return {
      fileId: e.id,
      fileName: e.filename,
      fileSize: orNull(storage?.size),
      url: orNull(storage?.url),
      createdAt: parseEpoch(e.createdAt),
      registrant: { id: e.Registrant?.id, email: e.Registrant?.email },
    };
  }
}
