import { Prisma, PrismaClient } from '@prisma/client';

export type PrismaTransactionalClient = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0];

// export type PrismaTransactionOptions = Parameters<PrismaClient['$transaction']>[1];

export type PrismaTransactionOptions = { timeout?: number; maxWait: number; isolationLevel?: Prisma.TransactionIsolationLevel };
