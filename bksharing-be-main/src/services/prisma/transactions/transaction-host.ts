import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { isNotEmpty } from 'class-validator';
import { ClsService } from 'nestjs-cls';
import { Propagation } from 'src/domains/notification/shared/transation.enum';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { PrismaService } from '../prisma.service';
import { TRANSACTIONAL_INSTANCE } from './transaction.constant';
import { PrismaTransactionOptions } from './transaction.type';

@Injectable()
export class TransactionHost {
  private readonly logger = new Logger(TransactionHost.name);
  constructor(
    private readonly clsService: ClsService,
    private readonly _default: PrismaService,
  ) {}

  /**
   *  The instance of the transaction object.
   *
   * this may be a transaction reference, a database client, or something else.
   *
   * If no transaction is active, this will return the _default (PrismaService) instance.
   */
  get tx(): PrismaClient {
    if (!this.clsService.isActive()) {
      return this._default;
    }

    return this.clsService.get(TRANSACTIONAL_INSTANCE) || this._default;
  }

  /**
   *
   * The transaction instance will be accessible on the TransactionHost as `tx`.
   *
   * This is useful when you want to run a function in a transaction, but can't use the `@Transactional()` decorator.
   *
   * @param fn The function to run in a transaction.
   * @param propagation The propagation mode to use, @see{Propagation}.
   * @param options Transaction options
   * @returns Whatever the passed function returns
   */
  withTransaction<R>(fn: (...args: any[]) => Promise<R>): Promise<R>;
  withTransaction<R>(options: PrismaTransactionOptions, fn: (...args: any[]) => Promise<R>): Promise<R>;
  withTransaction<R>(progation: Propagation, fn: (...args: any[]) => Promise<R>): Promise<R>;
  withTransaction<R>(progation: Propagation, options: PrismaTransactionOptions, fn: (...args: any[]) => Promise<R>): Promise<R>;
  withTransaction<R>(firstParam: any, secondParam?: any, thirdParam?: (...args: any[]) => Promise<R>) {
    let propagation: string;
    let options: any;
    let fn: (...args: any[]) => Promise<R>;
    if (thirdParam) {
      propagation = firstParam;
      options = secondParam;
      fn = thirdParam;
    } else if (secondParam) {
      fn = secondParam;
      if (typeof firstParam === 'string') {
        propagation = firstParam;
      } else {
        options = firstParam;
      }
    } else {
      fn = firstParam;
    }
    propagation ??= Propagation.Required;
    options = { ...TRANSACTION_TIMEOUT, ...options };
    return this.runWithTransactionAndPropagation(propagation, options, fn);
  }

  runWithTransactionAndPropagation<R>(propagation: string, options: any, fn: (...args: any[]) => Promise<R>): Promise<R> {
    const fnName = fn.name || 'anonymous';
    switch (propagation) {
      case Propagation.Required:
        if (this.isTransactionActive()) {
          if (isNotEmpty(options)) {
            this.logger.warn(
              `Transaction options are ignored because a transaction is already active and the propagation mode is ${propagation} (for method ${fnName}).`,
            );
          }
          return fn();
        } else {
          return this.runWithTransaction(options, fn);
        }
      case Propagation.RequiresNew:
        return this.runWithTransaction(options, fn);
      default:
        throw new ActionFailedException(ActionFailed.UNKNOW_PROPAGATION_MODE, `Unknown propagation mode: ${propagation}`);
    }
  }

  /**
   * Run a function in a transaction.
   *
   * @param fn The function to run in a transaction.
   * @returns Whatever the passed function returns
   */
  runWithTransaction(options: any, fn: (...args: any[]) => Promise<any>) {
    return this.clsService.run({ ifNested: 'inherit' }, async () => {
      return await this._default.$transaction(async (tx: PrismaService) => {
        this.setTxInstance.bind(this)(tx);
        try {
          return await fn();
        } catch (error) {
          throw error;
        } finally {
          this.setTxInstance.bind(this)(undefined);
        }
      }, options);
    });
  }

  /**
   * Wrap a function call to run outside of a transaction.
   *
   * @param fn The function to run outside of a transaction.
   * @returns Whatever the passed function returns
   */
  withoutTransaction<R>(fn: (...args: any[]) => Promise<R>): Promise<R> {
    return this.clsService.run({ ifNested: 'inherit' }, () => {
      this.setTxInstance(undefined);
      return fn().finally(() => this.setTxInstance(undefined));
    });
  }

  isTransactionActive() {
    if (!this.clsService.isActive()) {
      return false;
    }
    const instance = this.clsService.get(TRANSACTIONAL_INSTANCE);
    return !!instance;
  }

  private setTxInstance(txInstance?: PrismaClient) {
    if (!txInstance) {
      this.clsService.set(TRANSACTIONAL_INSTANCE, undefined);
      return;
    }

    this.clsService.set(TRANSACTIONAL_INSTANCE, txInstance);
  }
}
