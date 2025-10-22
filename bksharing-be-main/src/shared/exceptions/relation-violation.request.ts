import { ConflictException } from '@nestjs/common';

export class RelationViolationException extends ConflictException {
  constructor(relationName: string, modelA: string, modelB: string) {
    const errorMessage = `The change you are trying to make would violate the required relation ${relationName} between the ${modelA} and ${modelB} models.`;
    super(errorMessage);
    super.name = RelationViolationException.name;
    super.message = errorMessage;
  }
}
