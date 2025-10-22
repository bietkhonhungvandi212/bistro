import { AchievementType, EducationalLevel } from '@prisma/client';
import { FileRESP } from 'src/domains/file/response/file.response';
import { ImageRESP } from 'src/domains/image/response/image.response';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { parseEpoch } from 'src/shared/parsers/common.parser';
import { parsePrismaDateToEpoch } from 'src/shared/parsers/datetime.parse';
import { MentorGetPayload, ProfileAchievementGetPayload } from '../../shared/types';

export class MentorAchievementRESP {
  name?: string;
  organization: string;
  description: string;
  startDate: string;
  endDate: string | null;
  type: AchievementType;
  position?: string;
  major?: string;

  static filterAchievementType(e: ProfileAchievementGetPayload): MentorAchievementRESP {
    switch (e.type) {
      case AchievementType.EXPERIENCE:
        return {
          organization: e.organization,
          description: e.description,
          position: e.position,
          startDate: String(parsePrismaDateToEpoch(e.startDate)),
          endDate: e.endDate ? String(parsePrismaDateToEpoch(e.endDate)) : null,
          type: AchievementType.EXPERIENCE,
        };
      case AchievementType.EDUCATION:
        return {
          organization: e.organization,
          description: e.description,
          major: e.major,
          startDate: String(parsePrismaDateToEpoch(e.startDate)),
          endDate: e.endDate ? String(parsePrismaDateToEpoch(e.endDate)) : null,
          type: AchievementType.EDUCATION,
        };

      case AchievementType.CERTIFICATION:
        return {
          name: e.name,
          organization: e.organization,
          description: e.description,
          startDate: String(parsePrismaDateToEpoch(e.startDate)),
          endDate: e.endDate ? String(parsePrismaDateToEpoch(e.endDate)) : null,
          type: AchievementType.CERTIFICATION,
        };
      default:
        throw new ActionFailedException(ActionFailed.AUTH_ACHIEVEMENT_INVALID_TYPE);
    }
  }
}
export class MentorAdminDetailRESP {
  id: number;
  accountId: number;
  status: string;
  gender: string;
  dob: string;
  accpetedAt: string;
  createdAt: string;
  name: string;
  email: string;
  phoneNumber: string;
  targetLevels?: EducationalLevel[] = [];
  cv: FileRESP;
  thumbnail?: ImageRESP;
  achievements: MentorAchievementRESP[];

  static fromEntity(
    e: MentorGetPayload,
    achievements: ProfileAchievementGetPayload[],
    cv: FileRESP,
    thumbnail?: ImageRESP,
  ): MentorAdminDetailRESP {
    return {
      id: e.id,
      accountId: e.accountId,
      status: e.status,
      gender: e.Account.gender,
      dob: String(parsePrismaDateToEpoch(e.Account.dob)),
      accpetedAt: parseEpoch(e.accpetedAt),
      createdAt: parseEpoch(e.createdAt),
      name: e.Account.name,
      email: e.Account.email,
      phoneNumber: e.Account.phoneNumber,
      targetLevels: e.targetLevels,
      cv: cv,
      thumbnail: thumbnail,
      achievements: achievements.map((achievement) => MentorAchievementRESP.filterAchievementType(achievement)),
    };
  }
}
