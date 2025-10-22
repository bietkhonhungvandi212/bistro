import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventEmitterService } from './event-emitter.service';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [EventEmitterService],
  exports: [EventEmitterService],
})
export class EventNestModule {}
