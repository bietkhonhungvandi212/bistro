import { FileService } from 'src/domains/file/file.service';
import { ImageService } from 'src/domains/image/image.service';
import { AudioRoomParticipantRESP } from '../admin/response/audio-call-admin-detail.response';
import { AudioRoomParticipantGetPayload } from './types';

export const participantMapper = async (
  participants: AudioRoomParticipantGetPayload[],
  imageService: ImageService,
  fileService: FileService,
  transactionHost: any,
  isCvPublic: boolean = false,
): Promise<AudioRoomParticipantRESP[]> => {
  return await Promise.all(
    participants.map(async (participant: AudioRoomParticipantGetPayload) => {
      const thumbnail = await imageService.getImageOriginal(participant.Account.avatarId);
      let cv: any;
      if (participant.Account.accountType === 'MENTOR') {
        const mentor = await transactionHost.tx.mentor.findFirst({
          where: { accountId: participant.Account.id },
          select: {
            fileId: true,
          },
        });

        cv = isCvPublic ? await fileService.detail(mentor.fileId) : null;
      }

      return AudioRoomParticipantRESP.fromEntity(participant, thumbnail, cv);
    }),
  );
};
