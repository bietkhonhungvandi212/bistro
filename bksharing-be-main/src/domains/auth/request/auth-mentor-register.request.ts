import { AccountType, EducationalLevel, Gender, MentorStatus, Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { AccountCreateDTO } from 'src/domains/accounts/dto/account-create.dto';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { parsePrismaDate } from 'src/shared/parsers/datetime.parse';
import {
  AddressBaseValidator,
  AddressDetailValidator,
  EmailValidator,
  NameValidator,
  OtpValidator,
  PasswordValidator,
  PhoneNumberValidator,
} from 'src/shared/request-validator/account.validator';
import { ArrayNotDuplicated } from 'src/shared/request-validator/array-not-duplicated.request-validator';
import { OnlyDate } from 'src/shared/request-validator/only-date.request-validator';
import { AuthAchievementREQ } from './auth-achievement-register.request';

export class AuthMentorRegisterREQ {
  @EmailValidator()
  email: string;

  @PasswordValidator()
  password: string;

  @NameValidator()
  name: string;

  @PhoneNumberValidator()
  phoneNumber: string;

  @OnlyDate()
  dob: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(3)
  @ArrayMinSize(1)
  @Type(() => AuthAchievementREQ)
  @ValidateNested({ each: true })
  achievements: AuthAchievementREQ[];

  @IsArray()
  @IsOptional()
  @IsEnum(EducationalLevel, { each: true })
  @ArrayNotDuplicated(EducationalLevel)
  targetLevels?: EducationalLevel[] = [];

  @OtpValidator()
  @IsOptional()
  phoneOtpCode?: string;

  @IsOptional()
  @AddressBaseValidator()
  addressBase?: string;

  @IsOptional()
  @AddressDetailValidator()
  addressDetail?: string;

  @IsOptional()
  @IsNumber()
  fileId?: number;

  @IsOptional()
  @IsNumber()
  avatarId?: number;

  static toCreateAccountDto(body: AuthMentorRegisterREQ): AccountCreateDTO {
    const parseDob = parsePrismaDate(body.dob);

    return {
      name: body.name,
      gender: body.gender,
      email: body.email,
      password: body.password,
      phoneNumber: body.phoneNumber,
      addressBase: body.addressBase,
      addressDetail: body.addressDetail,
      dob: new Date(parseDob),
      accountType: AccountType.MENTOR,
    };
  }

  static toCreateMentorArgs(body: AuthMentorRegisterREQ, accountId: number): Prisma.MentorCreateArgs {
    return {
      data: {
        status: MentorStatus.PENDING,
        targetLevels: body.targetLevels,
        Account: connectRelation(accountId),
      },
      select: { id: true, accountId: true },
    };
  }

  static toCreateMentorProfileArgs(body: AuthMentorRegisterREQ, accountId: number): Prisma.ProfileAchievementCreateManyArgs {
    return {
      data: body.achievements.map((achievement) => {
        return AuthAchievementREQ.ToCreateByAchievementType(achievement, accountId);
      }),
    };
  }
}
