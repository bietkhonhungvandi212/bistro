import { Prisma } from '@prisma/client';

export class FileCreateRESP {
  fileId: number;
  url: string;

  static fromEntity(e: Prisma.FileGetPayload<unknown>, url: string): FileCreateRESP {
    return { fileId: e.id, url };
  }
}
