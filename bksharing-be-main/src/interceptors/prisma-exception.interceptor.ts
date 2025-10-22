import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { KeyDuplicationException } from 'src/shared/exceptions/key-duplication.exception';
import { PrismaClientValidationException } from 'src/shared/exceptions/prisma-client-validation.exception';
import { RelationViolationException } from 'src/shared/exceptions/relation-violation.request';
import { WriteRelationNotFoundException } from 'src/shared/exceptions/write-relation-not-found.exception';
import { DatabaseConnectionException } from '../shared/exceptions/database-connnection.exception';
import { UnknownPrismaException } from '../shared/exceptions/unknown-prisma.exception';

@Injectable()
export class PrismaExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PrismaExceptionInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        console.log('🚀 ~ PrismaExceptionInterceptor ~ catchError ~ error:', error);
        this.logger.error('PrismaExceptionInterceptor:', error);

        if (error instanceof PrismaClientValidationError) {
          throw new PrismaClientValidationException(error.message);
        } else if (error instanceof PrismaClientKnownRequestError) {
          switch (error.code) {
            case 'P2002':
              throw new KeyDuplicationException(error.meta.modelName as string, `${error.meta.target}` as string);
            case 'P2025':
              if (
                ['record to update', 'relation'].some((p) =>
                  error.meta?.cause?.toString().toLowerCase().includes(p.toLowerCase()),
                )
              ) {
                throw new WriteRelationNotFoundException(null, error.meta.modelName as string, error.meta.cause as string);
              }
              throw new EntityNotFoundException(undefined, error.message);
            case 'P2017':
              if (error.meta.relation_name) {
                throw new WriteRelationNotFoundException(
                  undefined,
                  error.meta.modelName as string,
                  `No relation between ${error.meta.parent_name} & ${error.meta.child_name}`,
                );
              }
              break;
            case 'P2014':
              if (error.meta.relation_name) {
                throw new RelationViolationException(
                  String(error.meta?.relation_name),
                  String(error.meta?.model_a_name),
                  String(error.meta?.model_b_name),
                );
              }
              break;
            // Handle additional known error codes here
            default:
              throw new UnknownPrismaException(error.message);
          }
        } else if (error instanceof PrismaClientUnknownRequestError) {
          throw new UnknownPrismaException(error.message);
        } else if (error instanceof PrismaClientInitializationError) {
          throw new DatabaseConnectionException(error.message);
        } else if (error instanceof PrismaClientRustPanicError) {
          throw new DatabaseConnectionException('The database encountered an unexpected panic.');
        }

        // If it's not a known Prisma error, rethrow it
        throw error;
      }),
    );
  }
}
