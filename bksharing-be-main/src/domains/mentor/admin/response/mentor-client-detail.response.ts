import { AchievementType, EducationalLevel, MentorStatus } from '@prisma/client';
import { ImageRESP } from 'src/domains/image/response/image.response';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { parsePrismaDateToEpoch } from 'src/shared/parsers/datetime.parse';
import { MentorGetPayload, ProfileAchievementGetPayload } from '../../shared/types';

export class MentorAchievementRESP {
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

  static filterAchievementType(e: ProfileAchievementGetPayload): MentorAchievementRESP {
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
export class MentorClientDetailRESP {
  id: number;
  accountId: number;
  bio?: string;
  name: string;
  gender: string;
  dob: string;
  status: MentorStatus;
  targetLevels?: EducationalLevel[] = [];
  thumbnail?: ImageRESP;
  noOfSubscriptions?: number;
  rateOfMentor?: number;
  achievements: MentorAchievementRESP[];

  static fromEntity(
    e: MentorGetPayload,
    achievements: ProfileAchievementGetPayload[],
    data: {
      noOfSubscriptions?: number;
      rateOfMentor?: number;
    },
    thumbnail?: ImageRESP,
  ): MentorClientDetailRESP {
    return {
      id: e.id,
      accountId: e.accountId,
      gender: e.Account.gender,
      status: e.status,
      dob: String(parsePrismaDateToEpoch(e.Account.dob)),
      bio: e.Account.bio,
      name: e.Account.name,
      targetLevels: e.targetLevels,
      thumbnail: thumbnail,
      noOfSubscriptions: data.noOfSubscriptions ?? 0,
      rateOfMentor: data.rateOfMentor ?? 0,
      achievements: achievements.map((achievement) => MentorAchievementRESP.filterAchievementType(achievement)),
    };
  }
}
