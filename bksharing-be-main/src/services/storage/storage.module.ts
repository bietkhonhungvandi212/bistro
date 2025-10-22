import { Module, OnModuleInit } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ConfigurableModuleClass } from './storgare.module-definition';

@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule extends ConfigurableModuleClass implements OnModuleInit {
  constructor(private readonly storageService: StorageService) {
    super();
  }

  async onModuleInit() {
    await this.storageService.pingCloudinary();
  }
}
