import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { AXIOS_CONFIG } from 'src/shared/constants/common.constant';
import { AxiosService } from './axios.service';

@Module({
  imports: [HttpModule],
})
export class AxiosModule {
  static register(options: { apiDomain: string }): DynamicModule {
    return {
      module: AxiosModule,
      providers: [
        {
          provide: AXIOS_CONFIG,
          useValue: options,
        },
        AxiosService,
      ],
      exports: [AxiosService],
    };
  }
}
