import { Module } from '@nestjs/common';
import { CLD_API_KEY, CLD_API_SECRET, CLD_CLOUD_NAME } from 'src/app.config';
import { AxiosModule } from './axios/axios.module';
import { EmailModule } from './email/email.module';
import { EventNestModule } from './event-emitter/event-emitter.module';
import { FcmModule } from './fcm/fcm.module';
import { GetstreamModule } from './getstream/getstream.module';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    /* Third-party Services */
    StorageModule.forRootAsync({
      useFactory: async () => ({
        cloud_name: CLD_CLOUD_NAME,
        api_key: CLD_API_KEY,
        api_secret: CLD_API_SECRET,
      }),
    }),
    PrismaModule,
    GetstreamModule,
    AxiosModule,
    FcmModule,
    EventNestModule,
    EmailModule,
  ],
})
export class CommonModule {}
