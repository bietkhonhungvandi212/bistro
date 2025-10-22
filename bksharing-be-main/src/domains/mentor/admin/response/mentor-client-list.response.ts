import { ImageRESP } from 'src/domains/image/response/image.response';
import { MentorGetPayload } from '../../shared/types';

export class MentorClientListRESP {
  id: number;
  accountId: number;
  name: string;
  thumbnail?: ImageRESP;
  bio?: string;
  noOfSubscriptions?: number;
  rateOfMentor?: number;

  static fromEntity(
    e: MentorGetPayload,
    data: {
      noOfSubscriptions?: number;
      rateOfMentor?: number;
    },
    thumbnail?: ImageRESP,
  ): MentorClientListRESP {
    return {
      id: e.id,
      accountId: e.accountId,
      name: e.Account.name,
      bio: e.Account.bio,
      thumbnail,
      noOfSubscriptions: data.noOfSubscriptions ?? 0,
      rateOfMentor: data.rateOfMentor ?? 0,
    };
  }
}
