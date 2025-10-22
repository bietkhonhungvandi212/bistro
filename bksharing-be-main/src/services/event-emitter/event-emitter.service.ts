import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventEmitterService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * Emit an event with the given payload
   * @param eventName Name of the event
   * @param payload Payload to emit with the event
   * @param options Optional configurations for emitting the event
   */
  emit<T = any>(eventName: string, payload: T, options?: EventOptions): void {
    if (options?.async) {
      this.eventEmitter.emitAsync(eventName, payload, options);
    } else {
      this.eventEmitter.emit(eventName, payload, options);
    }
  }
}
