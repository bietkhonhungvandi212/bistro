import { BooleanValidator } from 'src/shared/request-validator/boolean.request-validator';

export class CourseApproveREQ {
  @BooleanValidator()
  isApproved: boolean;
}
