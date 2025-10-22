import { PickType } from '@nestjs/swagger';
import { CourseClientListREQ } from 'src/domains/course/factory/list/course-client-list.request';

export class MentorClientCourseListREQ extends PickType(CourseClientListREQ, ['courseStatus']) {}
