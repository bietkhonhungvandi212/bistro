import type { ConfigOptions, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export type CloudinaryModuleOptions = ConfigOptions;

export type CloudinaryResultResponse =
  | UploadApiResponse
  | UploadApiErrorResponse
  | PromiseLike<UploadApiResponse | UploadApiErrorResponse>;
