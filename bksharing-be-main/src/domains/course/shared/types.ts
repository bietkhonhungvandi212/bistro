import { MentorClientDetailRESP } from 'src/domains/mentor/admin/response/mentor-client-detail.response';
import { CourseSectionDTO } from '../dto/course-section.dto';
export enum TargetAudienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export type CourseSectionUpdateDTO = {
  id: number;
} & CourseSectionDTO;

export type CourseMentorDetailRESP = Pick<MentorClientDetailRESP, 'id' | 'name' | 'thumbnail' | 'accountId'>;
