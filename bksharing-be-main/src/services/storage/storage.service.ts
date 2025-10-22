import { Inject, Injectable, Logger } from '@nestjs/common';
import { ResourceType, TransformationOptions, UploadApiErrorResponse, UploadApiOptions, UploadApiResponse, v2 } from 'cloudinary';
import sharp from 'sharp';
import { defaultCreateSignedUploadUrlOptions } from 'src/shared/constants/storage.constant';
import { Readable } from 'stream';
import { StorageDTO } from './dto/storage.dto';
import { ISharpInputOptions } from './shared/interfaces/sharp.interface';
import { ISignedUploadUrlOptions } from './shared/interfaces/signed-upload-url.interface';
import { CloudinaryModuleOptions } from './shared/types/cloudinary-config.types';
import { MODULE_OPTIONS_TOKEN } from './storgare.module-definition';

@Injectable()
export class StorageService {
  private logger = new Logger(StorageService.name);

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: CloudinaryModuleOptions,
  ) {
    v2.config(Object.assign({}, options));
  }

  async pingCloudinary() {
    try {
      const res = await v2.api.ping();
      this.logger.log(`Cloudinary ping response: ${res.status}`);
    } catch (e) {
      this.logger.warn('Cloudinary connection failed.');
      this.logger.error(e.error);
    }
  }

  /**
   * It takes a file, uploads it to cloudinary, and returns a promise
   * @param {IFile} file - IFile - This is the file object that is passed to the uploadFile method.
   * @param {UploadApiOptions} [options] - This is the options object that you can pass to the
   * uploader.upload_stream method.
   * @param {ISharpInputOptions} [sharpOptions] - This is an object that contains the options for sharp.
   * @returns {CloudinaryResultResponse},
   */
  async uploadFile(
    file: Express.Multer.File,
    options?: UploadApiOptions,
    sharpOptions?: ISharpInputOptions,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise(async (resolve, reject) => {
      const upload = v2.uploader.upload_stream(options, async (error, result) => {
        if (error) {
          this.logger.error(error);
          return reject(error);
        } else {
          resolve(result);
        }
      });

      const stream: Readable = new Readable();
      stream._read = () => {};

      if (sharpOptions && file.mimetype.match(/^image/)) {
        const options = { width: 320, ...sharpOptions };
        const shrinkedImage = await sharp(file.buffer).resize(options).toBuffer();
        stream.push(shrinkedImage);
      } else {
        stream.push(file.buffer);
      }

      stream.push(null);
      stream.pipe(upload);
    });
  }

  /**
   * It returns a signed upload URL.
   * @see https://cloudinary.com/documentation/signatures#using_cloudinary_backend_sdks_to_generate_sha_authentication_signatures
   * @param {string} publicId - This is the public id of the file.
   * @param {ResourceType} resourceType - The type of the resource. See ./node_modules/cloudinary/types/index.d.ts
   * @param {ISignedUploadUrlOptions} [options] - This is an object that contains the options for signing.
   * @returns string
   */
  async createSignedUploadUrl(publicId: string, resourceType: ResourceType, options?: ISignedUploadUrlOptions) {
    options = { ...defaultCreateSignedUploadUrlOptions, ...options };

    const url = `https://api.cloudinary.com/v1_1/${this.options.cloud_name}/${resourceType}/upload`;
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = v2.utils.api_sign_request(
      {
        timestamp,
        public_id: publicId,
        // eager: options.eager,
      },
      this.options.api_secret,
    );

    return {
      url,
      publicId,
      api_key: this.options.api_key,
      timestamp,
      eager: options.eager,
      folder: options.folder,
      signature,
    };
  }

  async checkFileExist(publicId: string): Promise<boolean> {
    try {
      const res = await v2.api.resource(publicId);
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async getSignedUrl(publicId: string, options?: TransformationOptions) {
    const isExisted = await this.checkFileExist(publicId);

    if (!isExisted) return null;
    return v2.utils.url(publicId, options);
  }

  async getStorageFile(publicId: string): Promise<StorageDTO | null> {
    try {
      // This will throw error when key not exists
      const file = await v2.api.resource(publicId);
      const url = v2.utils.url(publicId);
      return { size: file.bytes, url };
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
  async deleteFile(publicId: string) {
    const isExisted = await this.checkFileExist(publicId);
    if (!isExisted) return false;

    await v2.uploader.destroy(publicId);
    return true;
  }

  async deleteManyFiles(publicIds: string[]) {
    type FileStatus = { publicId: string; isDeleted: boolean };
    const deletedFiles = await Promise.all(
      publicIds.map(
        (publicId) =>
          new Promise<{ publicId: string; isDeleted: boolean }>(async (res) => {
            const isDeleted = await this.deleteFile(publicId);
            res({ publicId, isDeleted });
          }),
      ),
    );

    const getResult = (condition: (f: FileStatus) => boolean) => deletedFiles.filter(condition).map((f) => f.publicId);
    return {
      deletedKeys: getResult((f) => f.isDeleted),
      deletedFailedKeys: getResult((f) => !f.isDeleted),
    };
  }
}
