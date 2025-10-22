import { ConfigurableModuleBuilder } from '@nestjs/common';
import { CloudinaryModuleOptions } from './shared/types/cloudinary-config.types';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<CloudinaryModuleOptions>({
  moduleName: 'StorageModule',
})
  .setExtras(
    {
      isGlobal: true,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .setClassMethodName('forRoot')
  .build();
