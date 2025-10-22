import { Module } from '@nestjs/common';
import { StudentClientModule } from './client/student-client.module';

@Module({
  imports: [StudentClientModule],
})
export class StudentModule {}
