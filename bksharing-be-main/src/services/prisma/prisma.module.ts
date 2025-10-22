import { Global, Module } from '@nestjs/common';
import { PrismaRawService } from './prisma-raw.service';
import { PrismaService } from './prisma.service';
import { TransactionHost } from './transactions/transaction-host';

@Global()
@Module({
  providers: [PrismaService, PrismaRawService, TransactionHost],
  exports: [PrismaService, PrismaRawService, TransactionHost],
})
export class PrismaModule {}
