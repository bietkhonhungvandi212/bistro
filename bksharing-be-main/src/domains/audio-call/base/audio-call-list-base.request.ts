import { AccountType, AudioRoomType, Prisma, RoomStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { PaginationREQ } from 'src/shared/generics/pagination.request';
import { parsePrismaSearch } from 'src/shared/parsers/common.parser';
import { BooleanValidator } from 'src/shared/request-validator/boolean.request-validator';

export class AudioCallBaseListREQ extends PaginationREQ {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(AudioRoomType)
  @IsOptional()
  type?: AudioRoomType;

  @IsOptional()
  @BooleanValidator()
  isPublic?: boolean;

  @IsEnum(RoomStatus)
  @IsOptional()
  status?: RoomStatus;

  static toFilterByAccount(user: AuthUserDTO): Prisma.AudioRoomWhereInput {
    if (!user) return;
    switch (user.accountType) {
      case AccountType.ADMIN:
        return {};
      case AccountType.MENTOR:
        return {
          OR: [{ Creator: { id: user.accountId } }, { Participants: { some: { accountId: user.accountId } } }],
        };
      case AccountType.STUDENT:
        return {
          isPublic: false,
          Participants: {
            some: { accountId: user.accountId },
          },
        };
      default:
        throw new ActionFailedException(ActionFailed.ACCOUNT_INVALID_ROLE);
    }
  }

  static toQueryCondition(query: AudioCallBaseListREQ, user: AuthUserDTO): Prisma.AudioRoomWhereInput {
    const filtetByAccount = this.toFilterByAccount(user);
    return {
      AND: [filtetByAccount, parsePrismaSearch('title', query.title)],
      type: query.type,
      isPublic: query.isPublic,
      status: query.status,
    };
  }
}
