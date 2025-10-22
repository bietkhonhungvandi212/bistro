import { Inject } from '@nestjs/common';
import { copyMethodMetadata } from 'nestjs-cls';
import { Propagation } from 'src/domains/notification/shared/transation.enum';
import { TransactionHost } from './transaction-host';
import { PrismaTransactionOptions } from './transaction.type';

export function Transactional(propagation?: Propagation): MethodDecorator;
export function Transactional(options?: PrismaTransactionOptions): MethodDecorator;
export function Transactional(propagation: Propagation, options?: PrismaTransactionOptions): MethodDecorator;
export function Transactional(firstParam?: any, seconParam?: any): MethodDecorator {
  let propagation: Propagation | undefined;
  let options: any;

  if (seconParam) {
    propagation = firstParam;
    options = seconParam;
  } else if (firstParam) {
    if (paramIsPropagationType(firstParam)) {
      propagation = firstParam;
    } else {
      options = firstParam;
    }
  }

  const injectTransactionHost = Inject(TransactionHost);

  return ((target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<(...args: any) => Promise<any>>) => {
    if (!target.__transactionHost) {
      injectTransactionHost(target, '__transactionHost');
    }
    const original = descriptor.value;
    if (typeof original !== 'function') {
      throw new Error(
        `The @Transactional decorator can be only used on functions, but ${propertyKey.toString()} is not a function.`,
      );
    }
    descriptor.value = new Proxy(original, {
      apply: function (_, outerThis, args: any[]) {
        if (!outerThis['__transactionHost']) {
          throw new Error(`Failed to inject transaction host into ${target.constructor.name}`);
        }
        return (outerThis['__transactionHost'] as TransactionHost).withTransaction(
          propagation as Propagation,
          options as never,
          original.bind(outerThis, ...args),
        );
      },
    });
    copyMethodMetadata(original, descriptor.value);
  }) as MethodDecorator;
}

const paramIsPropagationType = (param: any): param is Propagation => {
  return typeof param === 'string' && Object.values(Propagation).includes(param as Propagation);
};
