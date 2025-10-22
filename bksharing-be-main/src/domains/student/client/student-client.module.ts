import { Module } from '@nestjs/common';
import { AuthModule } from 'src/domains/auth/auth.module';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { StudentClientController } from './student-client.controller';
import { StudentClientService } from './student-client.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [StudentClientController],
  providers: [StudentClientService],
})
export class StudentClientModule {}
