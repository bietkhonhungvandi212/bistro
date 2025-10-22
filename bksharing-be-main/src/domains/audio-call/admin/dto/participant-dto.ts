import { ParticipantAudioRoomRole } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { IdValidator } from 'src/shared/request-validator/id.validator';

export class AudioRoomParticipantDTO {
  @IdValidator()
  accountId: number;

  @IsEnum(ParticipantAudioRoomRole)
  @IsOptional()
  role?: ParticipantAudioRoomRole;

  @IsOptional()
  custom?: Record<string, any>;
}
