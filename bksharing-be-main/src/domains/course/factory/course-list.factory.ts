import { Injectable } from '@nestjs/common';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { CourseBaseListREQ } from '../shared/course-base-list.request';
import { CourseListDTOType } from '../shared/enums';
import { CourseAdminListREQ } from './list/course-admin-list.request';
import { CourseClientListREQ } from './list/course-client-list.request';

@Injectable()
export class CourseListFactory {
  getClass<T extends CourseBaseListREQ>(classType: CourseListDTOType, data: T): CourseBaseListREQ {
    switch (classType) {
      case CourseListDTOType.CLIENT:
        return new CourseClientListREQ(data);
      case CourseListDTOType.ADMIN:
        return new CourseAdminListREQ(data);
      default:
        throw new ActionFailedException(ActionFailed.CLASS_TYPE_NOT_FOUND);
    }
  }
}
