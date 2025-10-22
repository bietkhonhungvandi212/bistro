import { AccountSuspensionType, AudioRoomActivityHistory, CourseSuspensionType } from '@prisma/client';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { parseEpoch } from 'src/shared/parsers/common.parser';

export class ReportResolveHelper {
  public static calculateAccountSuspensionDays(noOfReports: number): AccountSuspensionType {
    if (noOfReports < 0) throw new ActionFailedException(ActionFailed.REPORT_QUANTITY_MUST_BE_GREATER_THAN_OR_EQUAL_TO_ZERO);

    switch (true) {
      case noOfReports >= 0 && noOfReports < 5:
        return AccountSuspensionType.ACCOUNT_NOT_SUSPENDED;
      case noOfReports >= 5 && noOfReports <= 7:
        return AccountSuspensionType.ACCOUNT_SUSPENDED_3_DAYS;
      case noOfReports > 7 && noOfReports < 11:
        return AccountSuspensionType.ACCOUNT_SUSPENDED_7_DAYS;
      default:
        return AccountSuspensionType.ACCOUNT_SUSPENDED_PERMANENTLY;
    }
  }

  public static calculateCourseSuspensionDays(noOfReports: number): CourseSuspensionType {
    console.log('🚀 ~ ReportResolveHelper ~ calculateCourseSuspensionDays ~ noOfReports:', noOfReports);
    if (noOfReports < 0) throw new ActionFailedException(ActionFailed.REPORT_QUANTITY_MUST_BE_GREATER_THAN_OR_EQUAL_TO_ZERO);

    switch (true) {
      case noOfReports >= 0 && noOfReports <= 1:
        return CourseSuspensionType.COURSE_NOT_SUSPENDED;
      case noOfReports > 1 && noOfReports <= 3:
        return CourseSuspensionType.COURSE_SUSPENDED_3_DAYS;
      case noOfReports > 3 && noOfReports <= 5:
        return CourseSuspensionType.COURSE_SUSPENDED_7_DAYS;
      default:
        return CourseSuspensionType.COURSE_SUSPENDED_PERMANENTLY;
    }
  }

  public static getTotalTimeInAudioRoom(audioRoomHistories: AudioRoomActivityHistory[]): number {
    const totalTimeInSeconds = audioRoomHistories.reduce((total, history) => {
      if (history.joinedAt && history.leftAt) {
        const duration = Math.abs(parseEpoch(history.joinedAt) - parseEpoch(history.leftAt));
        return total + duration;
      }

      return total;
    }, 0);

    return totalTimeInSeconds;
  }
}
