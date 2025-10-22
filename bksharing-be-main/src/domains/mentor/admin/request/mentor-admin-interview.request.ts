import { AudioRoomType, RoomStatus } from '@prisma/client';
import { IsString } from 'class-validator';
import { AudioCallAdminCreateREQ } from 'src/domains/audio-call/admin/request/audio-call-admin-create.request';
import { DateTimeValidator } from 'src/shared/request-validator/date-time.request.validator';

export class MentorAdminInterviewREQ {
  @IsString()
  title: string;

  @IsString()
  @DateTimeValidator()
  startsAt: string;

  static toAudioRoomCreateREQ(mentorId: number, body: MentorAdminInterviewREQ): AudioCallAdminCreateREQ {
    return {
      title: body.title,
      type: AudioRoomType.INTERVIEW,
      startsAt: body.startsAt,
      status: RoomStatus.SCHEDULED,
      members: [
        {
          accountId: mentorId,
          role: 'USER',
        },
      ],
    };
  }
}
