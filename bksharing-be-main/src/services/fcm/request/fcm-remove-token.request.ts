import { IsString } from 'class-validator';

export class FcmRemoveTokenREQ {
  @IsString()
  token: string;
}
