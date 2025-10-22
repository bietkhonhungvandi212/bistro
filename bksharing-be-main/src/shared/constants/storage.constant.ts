import { ISignedUploadUrlOptions } from 'src/services/storage/shared/interfaces/signed-upload-url.interface';

export const CLOUDINARY = Symbol('CLOUDINARY');

export const defaultCreateSignedUploadUrlOptions: Partial<ISignedUploadUrlOptions> = {
  folder: undefined,
  eager: undefined,
};

export const CLD_UPLOAD_IMAGE_OPTIONS = {
  access_mode: 'public',
  folder: 'images',
  use_filename: true,
};

export enum CLD_FOLDER {
  IMAGES = 'images',
  VIDEOS = 'videos',
  CVs = 'CVs',
  FILES = 'files',
}

export const IMAGE_TYPE = 'image';
