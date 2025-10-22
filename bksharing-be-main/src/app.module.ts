import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ClsModule } from 'nestjs-cls';
import { AccountModule } from './domains/accounts/accounts.module';
import { AudioCallModule } from './domains/audio-call/audio-call.module';
import { AuthModule } from './domains/auth/auth.module';
import { CategoryModule } from './domains/category/category.module';
import { ChatMessageModule } from './domains/chat-message/chat-message.module';
import { CourseModule } from './domains/course/course.module';
import { DashboardModule } from './domains/dashboard/dashboard.module';
import { FeedbackModule } from './domains/feedback/feedback.module';
import { FileModule } from './domains/file/file.module';
import { ImageModule } from './domains/image/image.module';
import { MentorModule } from './domains/mentor/mentor.module';
import { NotificationModule } from './domains/notification/notification.module';
import { PaymentModule } from './domains/payment/payment.module';
import { ReportModule } from './domains/report/report.module';
import { StudentModule } from './domains/student/student.module';
import { SubscriptionModule } from './domains/subscription/subscription.module';
import { UtilityModule } from './domains/utility/utility.module';
import { CommonModule } from './services/common.module';
import { VnpayModule } from './services/payment-gateway/vn-pay/vnpay.module';

@Module({
  imports: [
    // Register the ClsModule,
    ScheduleModule.forRoot(),
    ClsModule.forRoot({
      global: true,
      middleware: {
        // automatically mount the
        // ClsMiddleware for all routes
        mount: true,
        // and use the setup method to
        // provide default store values.
        setup: (cls, req) => {
          cls.set('userId', req.headers['x-user-id']);
        },
      },
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    CommonModule,
    UtilityModule,
    FileModule,
    ImageModule,
    /* API Service */
    VnpayModule,
    CategoryModule,
    AccountModule,
    AuthModule,
    CourseModule,
    StudentModule,
    MentorModule,
    AudioCallModule,
    PaymentModule,
    SubscriptionModule,
    ChatMessageModule,
    NotificationModule,
    FeedbackModule,
    DashboardModule,
    ReportModule,
  ],
})
export class AppModule {}
