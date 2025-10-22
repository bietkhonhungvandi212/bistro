import { FileRESP } from 'src/domains/file/response/file.response';
import { orNull } from 'src/shared/parsers/io.parser';
import { CourseSectionGetPayload } from 'src/shared/types/payload-prisma';

export class CourseSectionClientRESP {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  files: FileRESP[];

  static fromEntity(e: CourseSectionGetPayload, files?: FileRESP[]): CourseSectionClientRESP {
    return {
      id: e.id,
      title: e.title,
      description: e.description,
      isPublic: e.isPublic,
      files: orNull(files),
    };
  }
}
