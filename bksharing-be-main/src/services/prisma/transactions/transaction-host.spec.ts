import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AccountType, Prisma } from '@prisma/client';
import { ClsModule } from 'nestjs-cls';
import { PrismaModule } from '../prisma.module';
import { PrismaService } from '../prisma.service';
import { TransactionHost } from './transaction-host';
import { Transactional } from './transactional.decorator';

@Injectable()
class AccountRepository {
  constructor(private readonly txHost: TransactionHost) {}

  async getAccountById(id: number) {
    return this.txHost.tx.account.findUnique({ where: { id } });
  }

  async createAccount(name: string) {
    const random = Math.floor(Math.random() * 1000);
    const account = this.txHost.tx.account.create({
      data: {
        email: `${name}-${random}@gmail.com`,
        password: '12345678',
        phoneNumber: '0822333444',
        accountType: AccountType.STUDENT,
      },
    });
    return account;
  }
}

@Injectable()
class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly txHost: TransactionHost,
    private readonly prismaService: PrismaService,
  ) {}

  @Transactional()
  async transactionWithDecorator() {
    const r1 = await this.accountRepository.createAccount('john');
    const r2 = await this.accountRepository.getAccountById(r1.id as number);
    return { r1, r2 };
  }

  /*
   * The isolationLevel option is set to Serializable,
   * which means that the transaction is fully isolated from other transactions,
   * preventing phenomena like dirty reads, non-repeatable reads, and phantom reads.
   */
  @Transactional({
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
  })
  async transactionWithDecoratorWithOptions() {
    const r1 = await this.accountRepository.createAccount('James');
    const r2 = await this.prismaService.account.findUnique({
      where: { id: r1.id },
    });
    const r3 = await this.accountRepository.getAccountById(r1.id);
    return { r1, r2, r3 };
  }

  async transactionWithFunctionWrapper() {
    return this.txHost.withTransaction(
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
      async () => {
        const r1 = await this.accountRepository.createAccount('joe');
        const r2 = await this.prismaService.account.findUnique({
          where: { id: r1.id },
        });
        const r3 = await this.accountRepository.getAccountById(r1.id);
        return { r1, r2, r3 };
      },
    );
  }

  @Transactional()
  async transactionWithDecoratorError() {
    await this.accountRepository.createAccount('nobody');
    throw new Error('Rollback');
  }
}

describe('Transactional', () => {
  let callingService: AccountService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        PrismaModule,
        // Register the ClsModule,
        ClsModule.forRoot({
          global: true,
          middleware: {
            // automatically mount the
            // ClsMiddleware for all routes
            mount: true,
            // and use the setup method to
            // provide default store values.
          },
        }),
      ],
      providers: [AccountRepository, AccountService],
    }).compile();
    await moduleRef.init();
    callingService = moduleRef.get(AccountService);
    prisma = moduleRef.get(PrismaService);
  });

  describe('TransactionalDecorator', () => {
    it('should run a transaction with the default options with a decorator', async () => {
      const { r1, r2 } = await callingService.transactionWithDecorator();
      expect(r1).toEqual(r2);
      const users = await prisma.account.findMany();
      expect(users).toEqual(expect.arrayContaining([r1]));
    });

    it('should run a transaction with the specified options with a decorator', async () => {
      const { r1, r2, r3 } = await callingService.transactionWithDecoratorWithOptions();
      expect(r1).toEqual(r3);
      expect(r2).toBeNull();
      const users = await prisma.account.findMany();
      expect(users).toEqual(expect.arrayContaining([r1]));
    });
    it('should run a transaction with the specified options with a function wrapper', async () => {
      const { r1, r2, r3 } = await callingService.transactionWithFunctionWrapper();
      expect(r1).toEqual(r3);
      expect(r2).toBeNull();
      const users = await prisma.account.findMany();
      expect(users).toEqual(expect.arrayContaining([r1]));
    });

    it('should rollback a transaction on error', async () => {
      await expect(callingService.transactionWithDecoratorError()).rejects.toThrow(new Error('Rollback'));
      const users = await prisma.account.findMany();
      expect(users).toEqual(expect.not.arrayContaining([{ name: 'nobody' }]));
    });
  });
});
