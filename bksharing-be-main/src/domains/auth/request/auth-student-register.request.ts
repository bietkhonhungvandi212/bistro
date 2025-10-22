import { AccountType, EducationalLevel, Gender, Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
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
import { OnlyDate } from 'src/shared/request-validator/only-date.request-validator';
import { AuthAchievementREQ } from './auth-achievement-register.request';

export class AuthRegistrationStudentREQ {
  @EmailValidator()
  email: string;

  @PasswordValidator()
  password: string;

  @NameValidator()
  name: string;

  @PhoneNumberValidator()
  phoneNumber: string;

  @IsString()
  @MaxLength(255)
  major: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(3)
  @ArrayMinSize(1)
  @Type(() => AuthAchievementREQ)
  @ValidateNested({ each: true })
  achievements: AuthAchievementREQ[];

  @IsEnum(EducationalLevel)
  educationLevel: EducationalLevel;

  @OnlyDate()
  dob: string;

  @IsEnum(Gender)
  gender: Gender;

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

  static toCreateAccountDto(body: AuthRegistrationStudentREQ): AccountCreateDTO {
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
      accountType: AccountType.STUDENT,
    };
  }

  static toCreateStudentArgs(body: AuthRegistrationStudentREQ, accountId: number): Prisma.StudentCreateArgs {
    return {
      data: {
        Account: connectRelation(accountId),
        major: body.major,
        educationalLevel: body.educationLevel,
      },
      select: { id: true },
    };
  }

  static toCreateStudentProfileArgs(
    body: AuthRegistrationStudentREQ,
    accountId: number,
  ): Prisma.ProfileAchievementCreateManyArgs {
    return {
      data: body.achievements.map((achievement) => {
        return AuthAchievementREQ.ToCreateByAchievementType(achievement, accountId);
      }),
    };
  }
}
