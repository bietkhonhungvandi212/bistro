export enum Propagation {
  /**
   * (default) Reuse the existing transaction or create a new one if none exists.
   */
  Required = 'REQUIRED',
  /**
   * Create a new transaction even if one already exists. The new transaction is committed independently of the existing one.
   */
  RequiresNew = 'REQUIRES_NEW',
}
