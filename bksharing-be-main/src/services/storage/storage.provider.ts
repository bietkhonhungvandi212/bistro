import { ConfigOptions, v2 } from 'cloudinary';
import { CLD_API_KEY, CLD_API_SECRET, CLD_CLOUD_NAME } from 'src/app.config';
import { CLOUDINARY } from 'src/shared/constants/storage.constant';
export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): ConfigOptions => {
    return v2.config({
      cloud_name: CLD_CLOUD_NAME,
      api_key: CLD_API_KEY,
      api_secret: CLD_API_SECRET,
    });
  },
};
