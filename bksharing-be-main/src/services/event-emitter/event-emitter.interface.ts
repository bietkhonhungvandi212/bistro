interface EventOptions {
  /** Indicates if the event should be emitted asynchronously */
  async?: boolean;
  /** Any additional options to pass to the emitter */
  [key: string]: any;
}
