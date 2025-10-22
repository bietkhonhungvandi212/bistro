import { Prisma } from '@prisma/client';

export type StudentGetPayload = Prisma.StudentGetPayload<{ include: { Account: true } }>;
