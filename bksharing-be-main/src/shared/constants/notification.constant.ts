import { AccountSuspensionType, CourseSuspensionType, NotificationType } from '@prisma/client';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';

export const NOTIFICATION_MESSAGES = new Map<NotificationType, Record<string, string>>([
  [NotificationType.COURSE_CREATED, { title: 'New Course Created', content: 'A new course has been created successfully.' }],
  [NotificationType.COURSE_UPDATED, { title: 'Course Updated', content: 'A course has been updated successfully.' }],
  [NotificationType.COURSE_DELETED, { title: 'Course Deleted', content: 'A course has been deleted from the platform.' }],
  [NotificationType.COURSE_APPROVED, { title: 'Course Approved', content: 'Your course has been approved successfully.' }],
  [NotificationType.COURSE_REJECTED, { title: 'Course Rejected', content: 'Your course has been rejected.' }],
  [
    NotificationType.COURSE_SUSPENDED_WARNING,
    { title: 'Course Suspension Warn', content: 'Please review your course content for ensuring the quality.' },
  ],
  [
    NotificationType.COURSE_SUSPENDED_3_DAYS,
    { title: 'Course Suspended', content: 'Your course has been suspended for 3 days.' },
  ],
  [
    NotificationType.COURSE_SUSPENDED_7_DAYS,
    { title: 'Course Suspended', content: 'Your course has been suspended for 7 days.' },
  ],
  [
    NotificationType.COURSE_SUSPENDED_PERMANENTLY,
    { title: 'Course Suspended', content: 'Your course has been suspended permanently.' },
  ],

  [
    NotificationType.COURSE_NOT_YET_SCHEDULED,
    { title: 'Course Not Yet Scheduled', content: 'Your public course has not been scheduled yet. Please schedule your course.' },
  ],
  [
    NotificationType.SUBSCRIPTION_CANCELED_BECAUSE_OF_COURSE_SUSPENSION,
    { title: 'Subscription Canceled', content: 'Your subscription has been canceled because the course has been suspended.' },
  ],
  [
    NotificationType.SUBSCRIPTION_CANCELED_BECAUSE_OF_MENTOR_SUSPENSION,
    { title: 'Subscription Canceled', content: 'Your subscription has been canceled by the mentor.' },
  ],
  [
    NotificationType.SUBSCRIPTION_REFUND_BECAUSE_OF_COURSE_SUSPENSION,
    {
      title: 'Subscription Refunded',
      content: 'Your subscription has been refunded because the course has been suspended. We will try refunding within a week',
    },
  ],
  [
    NotificationType.SUBSCRIPTION_REFUND_BECAUSE_OF_MENTOR_SUSPENSION,
    {
      title: 'Subscription Refunded',
      content: 'Your subscription has been refunded by the mentor. We will try refunding within a week',
    },
  ],
  [
    NotificationType.MENTOR_REGISTERD,
    { title: 'Mentor Registered', content: 'A new mentor has been registered waiting for the consideration.' },
  ],
  [NotificationType.MENTOR_APPROVED, { title: 'Mentor Approved', content: 'Your mentor request has been approved.' }],
  [NotificationType.MENTOR_REJECTED, { title: 'Mentor Rejected', content: 'Your mentor request has been rejected.' }],
  [NotificationType.AUDIO_CALL_CREATED, { title: 'Audio Call Created', content: 'You have a new audio call' }],
  [NotificationType.AUDIO_CALL_STARTED, { title: 'Audio Call Started', content: 'Your audio call has been started' }],
  [
    NotificationType.SUBSCRIPTION_CREATED,
    { title: 'Subscription Request', content: 'A new subscription request has been made for your course.' },
  ],
  [
    NotificationType.SUBSCRIPTION_APPROVED,
    { title: 'Subscription Approved', content: 'Your subscription request has been approved successfully.' },
  ],
  [
    NotificationType.SUBSCRIPTION_REJECTED,
    { title: 'Subscription Rejected', content: 'Your subscription request has been rejected.' },
  ],
  [NotificationType.SUBSCRIPTION_EXPIRED, { title: 'Subscription Expired', content: 'This subscription has been expired.' }],
  [NotificationType.PAYMENT_SUCCESS, { title: 'Payment Successful', content: 'The subscription is paid successfully' }],
  [
    NotificationType.PAYMENT_FAILED,
    { title: 'Payment Failed', content: 'There was an issue processing your payment. Please try again.' },
  ],
  [
    NotificationType.DISCOUNT_AVAILABLE,
    { title: 'New Discount Available', content: "A new discount is now available. Don't miss out!" },
  ],
  [NotificationType.ADMIN_APPROVAL, { title: 'Admin Approval Required', content: 'Your request is awaiting admin approval.' }],
  [NotificationType.GENERAL_NOTIFICATION, { title: 'Notification', content: 'You have a new notification.' }],
  [NotificationType.COURSE_REPORTED, { title: 'Course Reported', content: 'One course has been reported.' }],
  [NotificationType.MENTOR_REPORTED, { title: 'Mentor Reported', content: 'One mentor has been reported.' }],
  [NotificationType.FEEDBACK_CREATED, { title: 'Feedback Created', content: 'A new feedback has been created.' }],
  [NotificationType.FEEDBACK_DELETED, { title: 'Feedback Deleted', content: 'A feedback has been deleted.' }],
  [NotificationType.FEEDBACK_REPORTED, { title: 'Feedback Reported', content: 'One feedback has been reported.' }],
  [
    NotificationType.REPORT_RESOLVED,
    { title: 'Report Resolved', content: 'Your report has been resolved. Please check the resolution.' },
  ],
  [
    NotificationType.REPORT_REJECTED,
    { title: 'Report Rejected', content: 'Your report has been rejected. Please check the resolution.' },
  ],
  [
    NotificationType.FEEDBACK_CONTAIN_INAPPROPRIATE_CONTENT,
    {
      title: 'Your feedback has been reported by author of the course',
      content: 'Your feedback has been removed because of violation or inappropriate content.',
    },
  ],
  [
    NotificationType.ACCOUNT_SUSPENDED_3_DAYS,
    {
      title: 'Account Suspended',
      content: 'Your account has been suspended for 3 days due to violation of terms and conditions.',
    },
  ],
  [
    NotificationType.ACCOUNT_SUSPENDED_7_DAYS,
    {
      title: 'Account Suspended',
      content: 'Your account has been suspended for 7 days due to violation of terms and conditions.',
    },
  ],
  [
    NotificationType.ACCOUNT_SUSPENDED_PERMANENTLY,
    {
      title: 'Account Suspended',
      content: 'Your account has been suspended permanently due to violation of terms and conditions.',
    },
  ],
  [
    NotificationType.ACCOUNT_SUSPENDED_WARNING,
    {
      title: 'Account Suspension Warning',
      content: 'Your account has been reported for violation of terms and conditions. Please review your activities.',
    },
  ],
]);

export const getNotificationMessage = (type: NotificationType) => {
  if (!NOTIFICATION_MESSAGES.has(type)) {
    throw new ActionFailedException(ActionFailed.NOTIFICATION_TYPE_NOT_FOUND, 'Notification type not found.');
  }
  return NOTIFICATION_MESSAGES.get(type);
};

export const NOTIFICATION_SUSPENSION_ACCOUNT_MAPPER = new Map<AccountSuspensionType, NotificationType>([
  [AccountSuspensionType.ACCOUNT_NOT_SUSPENDED, NotificationType.ACCOUNT_SUSPENDED_WARNING],
  [AccountSuspensionType.ACCOUNT_SUSPENDED_3_DAYS, NotificationType.ACCOUNT_SUSPENDED_3_DAYS],
  [AccountSuspensionType.ACCOUNT_SUSPENDED_7_DAYS, NotificationType.ACCOUNT_SUSPENDED_7_DAYS],
  [AccountSuspensionType.ACCOUNT_SUSPENDED_PERMANENTLY, NotificationType.ACCOUNT_SUSPENDED_PERMANENTLY],
]);

export const NOTIFICATION_SUSPENSION_COURSE_MAPPER = new Map<CourseSuspensionType, NotificationType>([
  [CourseSuspensionType.COURSE_NOT_SUSPENDED, NotificationType.COURSE_SUSPENDED_WARNING],
  [CourseSuspensionType.COURSE_SUSPENDED_3_DAYS, NotificationType.COURSE_SUSPENDED_3_DAYS],
  [CourseSuspensionType.COURSE_SUSPENDED_7_DAYS, NotificationType.COURSE_SUSPENDED_7_DAYS],
  [CourseSuspensionType.COURSE_SUSPENDED_PERMANENTLY, NotificationType.COURSE_SUSPENDED_PERMANENTLY],
]);

export const EMAIL_NOTIFICATION = {
  ACCOUNT_REGISTERED: {
    subject: 'BK SHARING - Welcome to BK Sharing',
    text: 'Welcome to BK Sharing. Your account has been created successfully. Please verify your email address.',
  },
  ACCOUNT_RESET_PASSWORD: {
    subject: 'BK SHARING - Reset Password',
    text: 'You have requested to reset your password. Please click on the link to reset your password.',
  },
};

export const EMAIL_TEMPLATES = {
  EMAIL_VERIFICATION: './authentication-email-verification',
  RESET_PASSWORD: './reset-password-verification',
};

export const EMAIL_PATH = {
  EMAIL_VERIFICATION: 'email-verification/',
  RESET_PASSWORD: 'reset-password-verification/',
};
