import { ImageRESP } from 'src/domains/image/response/image.response';
import { parsePrismaDateToEpoch } from 'src/shared/parsers/datetime.parse';

export class AccountRESP {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dob: string;
  addressBase: string | null;
  addressDetail: string | null;
  thumbnail?: ImageRESP;

  static fromEntity(e: AccountRESP, thumbnail?: ImageRESP): AccountRESP {
    return {
      id: e.id,
      name: e.name,
      email: e.email,
      gender: e.gender,
      phoneNumber: e.phoneNumber,
      dob: String(parsePrismaDateToEpoch(e.dob)),
      addressBase: e.addressBase,
      addressDetail: e.addressDetail,
      thumbnail,
    };
  }
}
