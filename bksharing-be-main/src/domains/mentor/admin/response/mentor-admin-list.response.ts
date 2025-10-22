import { AchievementType, MentorStatus } from '@prisma/client';
import { FileRESP } from 'src/domains/file/response/file.response';
import { ImageRESP } from 'src/domains/image/response/image.response';
import { parseEpoch } from 'src/shared/parsers/common.parser';
import { MentorGetPayload } from '../../shared/types';

export class MentorAdminListRESP {
  id: number;
  accountId: number;
  name: string;
  email: string;
  phoneNumber: string;
  registeredAt: string;
  status: MentorStatus;
  achievements: { type: AchievementType; isCurrent: boolean }[] = [];
  avatar?: ImageRESP;
  cv?: FileRESP;
  noOfSubscriptions?: number;
  rateOfMentor?: number;

  static fromEntity(
    e: MentorGetPayload,
    data: {
      noOfSubscriptions?: number;
      rateOfMentor?: number;
    },
    achievements: { type: AchievementType; isCurrent: boolean }[],
    thumnail?: ImageRESP,
    cv?: FileRESP,
  ): MentorAdminListRESP {
    return {
      id: e.id,
      status: e.status,
      accountId: e.accountId,
      name: e.Account.name,
      email: e.Account.email,
      phoneNumber: e.Account.phoneNumber,
      registeredAt: parseEpoch(e.createdAt),
      avatar: thumnail,
      cv: cv,
      noOfSubscriptions: data.noOfSubscriptions ?? 0,
      rateOfMentor: data.rateOfMentor ?? 0,
      achievements: achievements,
    };
  }
}
