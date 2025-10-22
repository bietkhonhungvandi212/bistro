import { ImageVersionType, Prisma } from '@prisma/client';
import { StorageDTO } from 'src/services/storage/dto/storage.dto';

export class ImageVersionRESP {
  id: number;
  url: string;
  fileId: number;
  fileSize: number | null;
  width: number;
  height: number;
  type: ImageVersionType;

  static getResolution(type: ImageVersionType): { width: number; height: number } {
    switch (type) {
      case 'THUMBNAIL':
        return { width: 200, height: 200 };
      case 'MEDIUM':
        return { width: 1280, height: 720 };
      case 'LARGE':
        return { width: 1920, height: 1080 };
    }
  }

  static fromEntity(e: Prisma.ImageVersionGetPayload<{ include: { File: true } }>, storage: StorageDTO): ImageVersionRESP {
    const resolution = ImageVersionRESP.getResolution(e.type);
    return {
      id: e.id,
      url: storage.url,
      fileId: e.File.id,
      fileSize: storage.size,
      width: resolution.width,
      height: resolution.height,
      type: e.type,
    };
  }

  static mock(imageUrl: string): ImageVersionRESP[] {
    const banner = ImageVersionRESP.getResolution(ImageVersionType.LARGE);
    const thumbnail = ImageVersionRESP.getResolution(ImageVersionType.THUMBNAIL);
    return [
      {
        id: 1,
        url: imageUrl,
        fileId: 1,
        fileSize: 1000,
        width: banner.width,
        height: banner.height,
        type: ImageVersionType.LARGE,
      },
      {
        id: 2,
        url: imageUrl,
        fileId: 2,
        fileSize: 2000,
        width: thumbnail.width,
        height: thumbnail.height,
        type: ImageVersionType.THUMBNAIL,
      },
    ];
  }
}
