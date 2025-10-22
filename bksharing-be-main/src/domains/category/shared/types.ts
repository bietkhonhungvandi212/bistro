import { Prisma } from '@prisma/client';

export type CategoryGetPayload = Prisma.CategoryGetPayload<{ include: { Courses: true } }>;
