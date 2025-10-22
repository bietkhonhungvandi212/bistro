import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PRE_FILTER_OPERATIONS } from 'src/shared/constants/prisma.constant';
import { addCreationTimestamps, addUpdationTimestamps } from 'src/shared/helpers/add-timestamp.helper';

const uniqueFieldsByModel: Record<string, string[]> = {};
const uniqueIndexFieldsByModel: Record<string, string[]> = {};

Prisma.dmmf.datamodel.models.forEach((model) => {
  // add unique fields derived from indexes
  const uniqueIndexFields: string[] = [];
  model.uniqueFields.forEach((field) => {
    uniqueIndexFields.push(field.join('_'));
  });
  uniqueIndexFieldsByModel[model.name] = uniqueIndexFields;

  // add id field and unique fields from @unique decorator
  const uniqueFields: string[] = [];
  model.fields.forEach((field) => {
    if (field.isId || field.isUnique) {
      uniqueFields.push(field.name);
    }
  });
  uniqueFieldsByModel[model.name] = uniqueFields;
});

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      // log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();

    Object.assign(
      this,
      this.$extends({
        query: {
          $allModels: {
            async $allOperations({ operation, args, query, model }) {
              const prisma = new PrismaClient();
              // filter the active records
              const filteredWhereConditions = {
                ...(args as any).where,
                isActive: true,
              };

              // change the operation from delete action to update action
              switch (operation) {
                case 'delete':
                  return await prisma[model].update({
                    ...args,
                    where: filteredWhereConditions,
                    data: addUpdationTimestamps({ isActive: false }),
                  });
                case 'deleteMany':
                  return await prisma[model].updateMany({
                    ...args,
                    where: filteredWhereConditions,
                    data: addUpdationTimestamps({ isActive: false }),
                  });
                case 'create':
                  return query({
                    ...args,
                    data: addCreationTimestamps(args.data),
                  });
                case 'createMany':
                  return query({
                    ...args,
                    data: (args.data as unknown[]).map((item: unknown) => addCreationTimestamps(item)),
                  });
                case 'update':
                case 'updateMany':
                  return query({
                    ...args,
                    where: filteredWhereConditions,
                    data: addUpdationTimestamps(args.data),
                  });
                default:
                  if (PRE_FILTER_OPERATIONS.includes(operation)) {
                    const filterdArgs = {
                      ...args,
                      where: filteredWhereConditions,
                    } as unknown;
                    return query(filterdArgs);
                  }
                  return query(args);
              }
            },
          },
        },
      }),
    );
  }

  async gracefulShutdown(application: INestApplication) {
    this.$on('beforeExit' as never, async () => {
      await application.close();
    });
  }
}
