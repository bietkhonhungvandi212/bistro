import { AudioRoomType, ParticipantAudioRoomRole, Prisma, RoomStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsJSON, IsOptional, IsString } from 'class-validator';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { addCreationTimestamps } from 'src/shared/helpers/add-timestamp.helper';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { parseDateTimeRequestToEpoch } from 'src/shared/parsers/datetime.parse';
import { DateTimeValidator } from 'src/shared/request-validator/date-time.request.validator';
import { AudioRoomParticipantDTO } from '../dto/participant-dto';

export class AudioCallAdminCreateREQ {
  @IsString()
  title: string;

  @IsEnum(AudioRoomType)
  type: AudioRoomType;

  @IsString()
  @DateTimeValidator()
  startsAt: string;

  @IsArray()
  @Type(() => AudioRoomParticipantDTO)
  @ArrayMaxSize(COMMON_CONSTANT.ARRAY_MAX_SIZE)
  @ArrayMinSize(COMMON_CONSTANT.ARRAY_MIN_SIZE)
  members: AudioRoomParticipantDTO[];

  @IsString()
  @IsOptional()
  roomUrl?: string;

  @IsEnum(RoomStatus)
  status: RoomStatus;

  @IsJSON()
  @IsOptional()
  metadata?: Record<string, any>;

  static toCreateInput(user: AuthUserDTO, body: AudioCallAdminCreateREQ): Prisma.AudioRoomCreateArgs {
    const members = body.members.map((member: AudioRoomParticipantDTO) => ({
      role: member.role ? member.role : ParticipantAudioRoomRole.USER,
      accountId: member.accountId,
    }));

    console.log('🚀 ~ AudioCallAdminCreateREQ ~ members ~ members:', members);
    const startsAt = parseDateTimeRequestToEpoch(body.startsAt);

    if (startsAt < Date.now()) {
      throw new ActionFailedException(ActionFailed.AUDIO_CALL_STARTS_AT_INVALID);
    }

    return {
      data: {
        title: body.title,
        type: body.type,
        roomUrl: body.roomUrl,
        metadata: body.metadata,
        status: body.status,
        startsAt: parseDateTimeRequestToEpoch(body.startsAt),
        Creator: connectRelation(user.accountId),
        Participants: {
          createMany: {
            data: [...members, { role: ParticipantAudioRoomRole.ADMIN, accountId: user.accountId }],
          },
        },
      },
      select: { id: true, startsAt: true, creatorId: true, Participants: { select: { accountId: true, role: true } } },
    };
  }

  static toCreateMemberInput(ownerId: number, body: AudioCallAdminCreateREQ): Prisma.AudioRoomCreateArgs {
    const members = body.members.map((member: AudioRoomParticipantDTO) =>
      addCreationTimestamps({
        role: member.role ? member.role : ParticipantAudioRoomRole.USER,
        accountId: member.accountId,
      }),
    );

    console.log('🚀 ~ AudioCallAdminCreateREQ ~ members ~ members:', members);
    const startsAt = parseDateTimeRequestToEpoch(body.startsAt);

    if (startsAt < Date.now()) {
      throw new ActionFailedException(ActionFailed.AUDIO_CALL_STARTS_AT_INVALID);
    }

    return {
      data: {
        title: body.title,
        type: body.type,
        roomUrl: body.roomUrl,
        metadata: body.metadata,
        status: body.status,
        startsAt: parseDateTimeRequestToEpoch(body.startsAt),
        Creator: connectRelation(ownerId),
        Participants: {
          createMany: {
            data: [...members, addCreationTimestamps({ role: ParticipantAudioRoomRole.ADMIN, accountId: ownerId })],
          },
        },
      },
      select: { id: true, startsAt: true, creatorId: true, Participants: { select: { accountId: true, role: true } } },
    };
  }
}
