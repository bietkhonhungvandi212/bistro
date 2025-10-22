import { AchievementType, EducationalLevel } from '@prisma/client';
import { ImageRESP } from 'src/domains/image/response/image.response';
import { ProfileAchievementGetPayload } from 'src/domains/mentor/shared/types';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { parsePrismaDateToEpoch } from 'src/shared/parsers/datetime.parse';
import { StudentGetPayload } from '../shared/types';

export class StudentAchievementRESP {
  id: number;
  name?: string;
  organization: string;
  description: string;
  startDate: string;
  isCurrent: boolean;
  endDate: string | null;
  type: AchievementType;
  position?: string;
  major?: string;

  static filterAchievementType(e: ProfileAchievementGetPayload): StudentAchievementRESP {
    switch (e.type) {
      case AchievementType.EXPERIENCE:
        return {
          id: e.id,
          organization: e.organization,
          description: e.description,
          position: e.position,
          isCurrent: e.isCurrent,
          startDate: String(parsePrismaDateToEpoch(e.startDate)),
          endDate: e.endDate ? String(parsePrismaDateToEpoch(e.endDate)) : null,
          type: AchievementType.EXPERIENCE,
        };
      case AchievementType.EDUCATION:
        return {
          id: e.id,
          organization: e.organization,
          description: e.description,
          major: e.major,
          isCurrent: e.isCurrent,
          startDate: String(parsePrismaDateToEpoch(e.startDate)),
          endDate: e.endDate ? String(parsePrismaDateToEpoch(e.endDate)) : null,
          type: AchievementType.EDUCATION,
        };

      case AchievementType.CERTIFICATION:
        return {
          id: e.id,
          name: e.name,
          organization: e.organization,
          description: e.description,
          isCurrent: e.isCurrent,
          startDate: String(parsePrismaDateToEpoch(e.startDate)),
          endDate: e.endDate ? String(parsePrismaDateToEpoch(e.endDate)) : null,
          type: AchievementType.CERTIFICATION,
        };
      default:
        throw new ActionFailedException(ActionFailed.AUTH_ACHIEVEMENT_INVALID_TYPE);
    }
  }
}
export class StudentClientDetailRESP {
  id: number;
  accountId: number;
  bio?: string;
  name: string;
  gender: string;
  dob: string;
  educationalLevel?: EducationalLevel;
  thumbnail?: ImageRESP;
  achievements: StudentAchievementRESP[];

  static fromEntity(
    e: StudentGetPayload,
    achievements: ProfileAchievementGetPayload[],
    thumbnail?: ImageRESP,
  ): StudentClientDetailRESP {
    return {
      id: e.id,
      accountId: e.accountId,
      gender: e.Account.gender,
      dob: String(parsePrismaDateToEpoch(e.Account.dob)),
      bio: e.Account.bio,
      name: e.Account.name,
      educationalLevel: e.educationalLevel,
      thumbnail: thumbnail,
      achievements: achievements.map((achievement) => StudentAchievementRESP.filterAchievementType(achievement)),
    };
  }
}
