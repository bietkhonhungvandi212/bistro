import {
  AccountStatus,
  Course,
  CourseStatus,
  Mentor,
  MentorStatus,
  Payment,
  Prisma,
  Report,
  ReportStatus,
  Subscription,
  SubscriptionStatus,
} from '@prisma/client';
import { StudentGetPayload } from 'src/domains/student/shared/types';
import { IS_ACTIVE_NESTED } from 'src/shared/constants/prisma.constant';
import { filterByDateRange } from 'src/shared/helpers/date-range.helper';
import { parseDecimalNumber } from 'src/shared/parsers/common.parser';
import { StatisticOverviewListREQ } from '../request/statistic-overview-list.request';
import {
  StatisticCourseOverviewRESP,
  StatisticMentorOverviewRESP,
  StatisticReportOverviewRESP,
  StatisticRevenueOverviewRESP,
  StatisticStudentOverviewRESP,
  StatisticSubscriptionOverviewRESP,
} from '../response/statistic-overview-list.response';

export class StatisticOverviewAdminListHelper {
  static toCountConditionQuery(query: StatisticOverviewListREQ) {
    const filterDateRange = filterByDateRange(query.dateRange);

    return { ...filterDateRange };
  }

  static toFindManyMentor(query: StatisticOverviewListREQ): Prisma.MentorFindManyArgs {
    const condition = this.toCountConditionQuery(query);

    return {
      where: { ...condition, Account: { status: AccountStatus.ACTIVE, ...IS_ACTIVE_NESTED } },
      select: { status: true },
    };
  }

  // static toFindManyStudent(query: StatisticOverviewListREQ): Prisma.StudentFindManyArgs {
  //   const condition = this.toCountConditionQuery(query);

  //   return {
  //     where: { ...condition, Account: { status: AccountStatus.ACTIVE, ...IS_ACTIVE_NESTED } },
  //     select: {}
  //   };
  // }

  static toFindManyCourse(query: StatisticOverviewListREQ): Prisma.CourseFindManyArgs {
    const condition = this.toCountConditionQuery(query);

    return {
      where: { ...condition },
      select: { status: true },
    };
  }

  static toFindManySubscription(query: StatisticOverviewListREQ): Prisma.SubscriptionFindManyArgs {
    const condition = this.toCountConditionQuery(query);

    return {
      where: { ...condition },
      select: { status: true },
    };
  }

  static toFindManyReport(query: StatisticOverviewListREQ): Prisma.ReportFindManyArgs {
    const condition = this.toCountConditionQuery(query);

    return {
      where: { ...condition },
      select: { status: true },
    };
  }

  static toFindManyPayment(query: StatisticOverviewListREQ): Prisma.PaymentFindManyArgs {
    const condition = this.toCountConditionQuery(query);

    return {
      where: { ...condition },
      select: { status: true, price: true, refundedPrice: true },
    };
  }

  static toFindManyStudent(query: StatisticOverviewListREQ): Prisma.StudentFindManyArgs {
    const condition = this.toCountConditionQuery(query);

    return {
      where: { ...condition },
      select: { Account: { select: { status: true } } },
    };
  }

  static getMentorOverview(mentors: Mentor[]): StatisticMentorOverviewRESP {
    const mentorOverview: StatisticMentorOverviewRESP = {
      approvedMentor: 0,
      pendingMentor: 0,
    };

    mentors.forEach((mentor) => {
      if (mentor.status === MentorStatus.ACCEPTED) {
        mentorOverview.approvedMentor++;
      } else if (mentor.status === MentorStatus.PENDING) {
        mentorOverview.pendingMentor++;
      }
      //  else if (mentor.status ===  MentorStatus.) {
      //   mentorOverview.interviewScheduledMentor++;
      // }
    });

    return mentorOverview;
  }

  static getCourseOverview(courses: Course[]): StatisticCourseOverviewRESP {
    const courseOverview: StatisticCourseOverviewRESP = {
      approvedCourse: 0,
      pendingCourse: 0,
      suspendedCourse: 0,
    };

    courses.forEach((course) => {
      if (course.status === CourseStatus.APPROVED) {
        courseOverview.approvedCourse++;
      } else if (course.status === CourseStatus.PENDING) {
        courseOverview.pendingCourse++;
      } else if (course.status === CourseStatus.SUSPENDED) {
        courseOverview.suspendedCourse++;
      }
    });

    return courseOverview;
  }

  static getSubscriptionOverview(subscriptions: Subscription[]): StatisticSubscriptionOverviewRESP {
    const subscriptionOverview: StatisticSubscriptionOverviewRESP = {
      activeSubscription: 0,
      pendingSubscription: 0,
      expiredSubscription: 0,
      cancelledSubscription: 0,
    };

    subscriptions.forEach((subscription) => {
      if (subscription.status === SubscriptionStatus.ACTIVE || subscription.status === SubscriptionStatus.ENDED) {
        subscriptionOverview.activeSubscription++;
      } else if (subscription.status === SubscriptionStatus.PENDING) {
        subscriptionOverview.pendingSubscription++;
      } else if (subscription.status === SubscriptionStatus.EXPIRED) {
        subscriptionOverview.expiredSubscription++;
      } else if (subscription.status === SubscriptionStatus.CANCELED) {
        subscriptionOverview.cancelledSubscription++;
      }
    });

    return subscriptionOverview;
  }

  static getReportOverview(reports: Report[]): StatisticReportOverviewRESP {
    const reportOverview: StatisticReportOverviewRESP = {
      pendingReport: 0,
      resolvedReport: 0,
    };

    reports.forEach((report) => {
      if (report.status === ReportStatus.PENDING) {
        reportOverview.pendingReport++;
      } else if (report.status === ReportStatus.RESOLVED) {
        reportOverview.resolvedReport++;
      }
    });

    return reportOverview;
  }

  static getPaymentOverview(payments: Payment[]): StatisticRevenueOverviewRESP {
    const paymentOverview: StatisticRevenueOverviewRESP = {
      totalRevenue: 0,
      refundAmount: 0,
    };

    return payments.reduce((acc, payment) => {
      const revenue = parseDecimalNumber(payment.price) - parseDecimalNumber(payment.refundedPrice ?? 0);
      const refundAmount = parseDecimalNumber(payment.refundedPrice);

      return { totalRevenue: acc.totalRevenue + revenue, refundAmount: acc.refundAmount + refundAmount };
    }, paymentOverview);
  }

  static getStudentOverview(students: StudentGetPayload[]): StatisticStudentOverviewRESP {
    const studentOverview: StatisticStudentOverviewRESP = {
      activeStudent: 0,
      suspendedStudent: 0,
    };

    students.forEach((student) => {
      if (student.Account.status === AccountStatus.ACTIVE) {
        studentOverview.activeStudent++;
      } else if (student.Account.status === AccountStatus.SUSPENDED) {
        studentOverview.suspendedStudent++;
      }
    });

    return studentOverview;
  }
}
