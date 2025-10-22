export class StatisticMentorOverviewRESP {
  approvedMentor: number;
  pendingMentor: number;
}

export class StatisticCourseOverviewRESP {
  approvedCourse: number;
  pendingCourse: number;
  suspendedCourse: number;
}

export class StatisticReportOverviewRESP {
  pendingReport: number;
  resolvedReport: number;
}

export class StatisticSubscriptionOverviewRESP {
  activeSubscription: number;
  pendingSubscription: number;
  expiredSubscription: number;
  cancelledSubscription: number;
}

export class StatisticRevenueOverviewRESP {
  totalRevenue: number;
  refundAmount: number;
}

export class StatisticStudentOverviewRESP {
  activeStudent: number;
  suspendedStudent: number;
}

export class StatisticOverviewListRESP {
  mentorOverview: StatisticMentorOverviewRESP;
  courseOverview: StatisticCourseOverviewRESP;
  reportOverview: StatisticReportOverviewRESP;
  subscriptionOverview: StatisticSubscriptionOverviewRESP;
  revenueOverview: StatisticRevenueOverviewRESP;
  studentOverview: StatisticStudentOverviewRESP;
}

export class StatisticOverviewClientListRESP {
  courseOverview: StatisticCourseOverviewRESP;
  subscriptionOverview: StatisticSubscriptionOverviewRESP;
  revenueOverview: StatisticRevenueOverviewRESP;
}
