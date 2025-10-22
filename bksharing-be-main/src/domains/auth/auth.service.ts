import { BadRequestException, Injectable, Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountStatus, AccountType, NotificationRelationType, NotificationType, Token, TokenType } from '@prisma/client';
import { EMAIL_VERIFY_URL } from 'src/app.config';
import { EventEmitterService } from 'src/services/event-emitter/event-emitter.service';
import { PrismaRawService } from 'src/services/prisma/prisma-raw.service';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { EMAIL_NOTIFICATION, EMAIL_PATH, EMAIL_TEMPLATES } from 'src/shared/constants/notification.constant';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { BaseResponse } from 'src/shared/generics/base.response';
import { runFunctionWithCondition } from 'src/shared/helpers/common.helper';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { AccountErrorMessages } from 'src/shared/messages/error-messages';
import { AccountService } from '../accounts/account.service';
import { FileService } from '../file/file.service';
import { ImageService } from '../image/image.service';
import { NotificationHelper } from '../notification/helper/notification-common.helper';
import { NotificationAppHandlerPayload, NotificationChannel, NotificationEmailPayload } from '../notification/shared/types';
import { AuthJwtPayloadDTO } from './dto/auth-jwt-payload.dto';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthEmailVerificationREQ } from './request/auth-email-verification.request';
import { AuthFindPasswordResetREQ } from './request/auth-find-password-reset.request';
import { AuthMentorRegisterREQ } from './request/auth-mentor-register.request';
import { AuthRegistrationStudentREQ } from './request/auth-student-register.request';
import { AuthTestAccountREQ } from './request/auth-test-account.request';
import { AuthLoginRESP } from './response/auth-login.response';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly transactionHost: TransactionHost,
    private readonly prismaRawService: PrismaRawService,
    private readonly accountService: AccountService,
    private readonly imageService: ImageService,
    private readonly fileService: FileService,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  async onModuleInit() {
    const admins = await this.transactionHost.tx.account.updateMany({
      where: { accountType: AccountType.ADMIN },
      data: { password: this.accountService.hashPassword('123!Admin') },
    });

    this.logger.log('🚀 ~ AuthService ~ onModuleInit ~ admins:', admins);

    const mentor = await this.transactionHost.tx.account.updateMany({
      where: { accountType: AccountType.MENTOR },
      data: { password: this.accountService.hashPassword('123!Mentor') },
    });

    this.logger.log('🚀 ~ AuthService ~ onModuleInit ~ mentor:', mentor);

    const students = await this.transactionHost.tx.account.updateMany({
      where: { accountType: AccountType.STUDENT },
      data: { password: this.accountService.hashPassword('123!Student') },
    });

    this.logger.log('🚀 ~ AuthService ~ onModuleInit ~ students:', students);
  }

  async login(body: AuthLoginDTO) {
    /* 1. Validate credential */
    try {
      const account = await this.transactionHost.tx.account.findFirstOrThrow(AuthLoginDTO.toFindAccountUnique(body));
      const isMatched = this.accountService.verifyPassword(body.password, account.password);
      if (!isMatched) throw new BadRequestException('Wrong password or username');

      /* 2. Validate login request (SKIP for SUPER_ADMIN) */
      const jwtToken = this.jwtService.sign({
        sub: String(account.id),
      } as AuthJwtPayloadDTO);

      return BaseResponse.of(
        AuthLoginRESP.fromAccount(account as any, jwtToken, await this.imageService.getImageOriginal(account.avatarId)),
      );
    } catch (e) {
      this.logger.error('🚀 ~ AuthService ~ login ~ e:', e);
      throw new UnauthorizedException();
    }
  }

  @Transactional()
  async createTestAccount(body: AuthTestAccountREQ) {
    const account = await this.accountService.createAccount(AuthTestAccountREQ.toAccountDto(body));

    return account;
  }

  async validateEmail(body: AuthEmailVerificationREQ) {
    const account = await this.transactionHost.tx.account.findFirst({ where: { email: body.email } });
    if (account) throw new ActionFailedException(ActionFailed.AUTH_EMAIL_EXISTED, 'Email existed');
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async registerStudent(body: AuthRegistrationStudentREQ) {
    /* 2. Check email duplicate */
    const existedAccount = await this.transactionHost.tx.account.findFirst({
      where: { email: body.email, status: AccountStatus.ACTIVE },
      select: { id: true },
    });

    if (existedAccount) throw new ActionFailedException(ActionFailed.AUTH_EMAIL_EXISTED, AccountErrorMessages.MSG02);

    /* 3. Create account */
    const account = await this.accountService.createAccount(AuthRegistrationStudentREQ.toCreateAccountDto(body));
    this.logger.log('🚀 ~ AuthService ~ registerStudent ~ account:', account);

    const student = await this.transactionHost.tx.student.create(
      AuthRegistrationStudentREQ.toCreateStudentArgs(body, account.id),
    );
    this.logger.log('🚀 ~ AuthService ~ registerStudent ~ student:', student);

    let imageId: number;
    if (body.fileId) imageId = await this.imageService.linkImageToAccount(account.id, body.fileId);

    /* 4. Create profile/ achivement */
    if (body.achievements && body.achievements.length > 0) {
      let isOneCurrent = false;

      body.achievements.forEach((achievement) => {
        if (achievement.isCurrent) {
          if (isOneCurrent)
            throw new ActionFailedException(
              ActionFailed.AUTH_MENTOR_ACHIEVEMENT_CURRENT_DUPLICATED,
              'Current achievement duplicated',
            );
          isOneCurrent = true;
        }
      });

      await this.transactionHost.tx.profileAchievement.createMany(
        AuthRegistrationStudentREQ.toCreateStudentProfileArgs(body, account.id),
      );
    }

    const jwtToken = this.jwtService.sign({
      sub: String(account.id),
    } as AuthJwtPayloadDTO);

    await this.registerTokenVerification(account.id, jwtToken);

    /* 4. Send Email */
    runFunctionWithCondition(!!account, () => {
      this.eventEmitterService.emit<NotificationEmailPayload>(
        NotificationChannel.EMAIL,
        this.createEmailVerificationPayload(
          account.email,
          account.name,
          EMAIL_VERIFY_URL + EMAIL_PATH.EMAIL_VERIFICATION + jwtToken,
        ),
      );
    });

    return { account, imageId };
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async registerMentor(body: AuthMentorRegisterREQ) {
    /* 1. Check email duplicate */
    const existedAccount = await this.transactionHost.tx.account.findFirst({
      where: { email: body.email, status: AccountStatus.ACTIVE },
      select: { id: true },
    });

    if (existedAccount) throw new ActionFailedException(ActionFailed.AUTH_EMAIL_EXISTED, AccountErrorMessages.MSG02);

    /* 2. Create mentor account */
    const account = await this.accountService.createAccount(AuthMentorRegisterREQ.toCreateAccountDto(body));

    const mentor = await this.transactionHost.tx.mentor.create(AuthMentorRegisterREQ.toCreateMentorArgs(body, account.id));

    /* 3. Create profile/ achivement */
    if (body.achievements && body.achievements.length > 0) {
      const current = { EDUCATION: false, EXPERIENCE: false };

      body.achievements.forEach((achievement) => {
        if (achievement.isCurrent) {
          if (current[achievement.achievementType]) {
            throw new ActionFailedException(
              ActionFailed.AUTH_MENTOR_ACHIEVEMENT_CURRENT_DUPLICATED,
              'Current achievement duplicated',
            );
          }
          current[achievement.achievementType] = true;
        }
      });

      await this.transactionHost.tx.profileAchievement.createMany(
        AuthMentorRegisterREQ.toCreateMentorProfileArgs(body, mentor.accountId),
      );
    }

    let imageId: number;
    if (body.avatarId) imageId = await this.imageService.linkImageToAccount(account.id, body.avatarId);

    //TODO: Check file in the format PDF, WORD
    if (body.fileId) await this.linkCVToMentor(mentor.id, body.fileId);

    const jwtToken = this.jwtService.sign({
      sub: String(account.id),
    } as AuthJwtPayloadDTO);

    const admin = await this.transactionHost.tx.account.findFirst({
      where: { accountType: AccountType.ADMIN },
      select: { id: true },
    });

    await this.registerTokenVerification(account.id, jwtToken);

    //NOTIFICATION: Send notification to admin
    const appPayload = NotificationHelper.makeAppNotificationPayload(
      { id: mentor.id, type: NotificationRelationType.MENTOR },
      admin.id,
      NotificationType.MENTOR_REGISTERD,
    );

    runFunctionWithCondition(!!mentor, () => {
      this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, appPayload);
      this.eventEmitterService.emit<NotificationEmailPayload>(
        NotificationChannel.EMAIL,
        this.createEmailVerificationPayload(
          account.email,
          account.name,
          EMAIL_VERIFY_URL + EMAIL_PATH.EMAIL_VERIFICATION + jwtToken,
        ),
      );
    });

    return { account, imageId };
  }

  async registerTokenVerification(accountId: number, token: string) {
    await this.transactionHost.tx.token.create({
      data: {
        token: token,
        type: TokenType.VERIFY,
        Account: connectRelation(accountId),
      },
      select: { id: true },
    });
  }

  createEmailVerificationPayload(email: string, name: string, url: string): NotificationEmailPayload {
    return {
      data: {
        email: email,
        ...EMAIL_NOTIFICATION.ACCOUNT_REGISTERED,
      },
      template: {
        path: EMAIL_TEMPLATES.EMAIL_VERIFICATION,
        context: {
          url: url,
          name: name,
        },
      },
    };
  }

  async verifyEmail(token: string) {
    try {
      await this.transactionHost.tx.token.findFirstOrThrow({
        where: { token: token, type: TokenType.VERIFY },
        select: { id: true, accountId: true },
      });
    } catch (e) {
      this.logger.error('🚀 ~ AuthService ~ verifyEmail ~ e:', e);
      throw new ActionFailedException(ActionFailed.AUTH_TOKEN_INVALID, 'Token invalid');
    }

    const newAccount = await this.transactionHost.tx.account.update({
      where: { id: this.getAccountIdFromToken(token) },
      data: { status: AccountStatus.ACTIVE },
      select: { id: true, avatarId: true, name: true, email: true, accountType: true, status: true },
    });

    const deletedAccountCondition = { email: newAccount.email, status: AccountStatus.INACTIVE };

    await this.prismaRawService.profileAchievement.deleteMany({
      where: { Account: deletedAccountCondition },
    });

    await this.prismaRawService.mentor.deleteMany({
      where: { Account: deletedAccountCondition },
    });

    await this.prismaRawService.student.deleteMany({
      where: { Account: deletedAccountCondition },
    });

    await this.prismaRawService.account.deleteMany({
      where: deletedAccountCondition,
    });

    await this.prismaRawService.token.deleteMany({
      where: {
        OR: [{ accountId: this.getAccountIdFromToken(token) }, { Account: deletedAccountCondition }],
      },
    });

    return { account: newAccount, jwtToken: token, imageId: newAccount.avatarId };
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async sendEmailForgotPassword(body: AuthEmailVerificationREQ) {
    let account: any;
    try {
      account = await this.transactionHost.tx.account.findFirstOrThrow({
        where: { email: body.email, status: AccountStatus.ACTIVE },
        select: { id: true, email: true },
      });
    } catch (e) {
      this.logger.error('🚀 ~ AuthService ~ sendEmailResetPassword ~ e:', e);
      throw new ActionFailedException(ActionFailed.ACCOUNT_EMAIL_NOT_FOUND, 'Email not found');
    }

    const jwtToken = this.jwtService.sign({
      sub: String(account.id),
    } as AuthJwtPayloadDTO);

    await this.registerTokenVerification(account.id, jwtToken);

    const emailPayload: NotificationEmailPayload = {
      data: {
        email: account.email,
        ...EMAIL_NOTIFICATION.ACCOUNT_RESET_PASSWORD,
      },
      template: {
        path: EMAIL_TEMPLATES.RESET_PASSWORD,
        context: {
          url: EMAIL_VERIFY_URL + EMAIL_PATH.RESET_PASSWORD + jwtToken,
        },
      },
    };

    this.eventEmitterService.emit<NotificationEmailPayload>(NotificationChannel.EMAIL, emailPayload);
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async verifyToken(token: string) {
    let existedToken: Token;
    try {
      existedToken = (await this.transactionHost.tx.token.findFirstOrThrow({
        where: { token: token, type: TokenType.VERIFY },
        select: { id: true, accountId: true },
      })) as Token;
    } catch (e) {
      this.logger.error('🚀 ~ AuthService ~ verifyEmail ~ e:', e);
      throw new ActionFailedException(ActionFailed.AUTH_TOKEN_INVALID, 'Token invalid');
    }

    await this.prismaRawService.token.deleteMany({
      where: { AND: [{ id: { not: existedToken.id } }, { accountId: this.getAccountIdFromToken(token) }] },
    });
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async resetPassword(body: AuthFindPasswordResetREQ) {
    let token: Token;
    try {
      token = (await this.transactionHost.tx.token.findFirstOrThrow({
        where: { token: body.token, type: TokenType.VERIFY },
        select: { id: true, accountId: true },
      })) as Token;
    } catch (e) {
      this.logger.error('🚀 ~ AuthService ~ verifyEmail ~ e:', e);
      throw new ActionFailedException(ActionFailed.AUTH_TOKEN_INVALID, 'Token invalid');
    }

    await this.accountService.resetPassword(token.accountId, body.password);

    await this.prismaRawService.token.deleteMany({
      where: { accountId: token.accountId },
    });
  }

  getAccountIdFromToken(token: string) {
    if (!token) return null;

    const accountId = this.jwtService.decode(token, { json: true }).sub;

    return Number(accountId);
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async linkCVToMentor(mentorId: number, fileId: number) {
    await this.fileService.checkAttachmentUploadedOrThrow([fileId]);
    await this.fileService.checkFileLinked([fileId]);

    /* Create and link file */
    await this.fileService.enableUploaded([fileId]);
    await this.transactionHost.tx.mentor.update({
      where: { id: mentorId },
      data: { File: connectRelation(fileId) },
      select: { id: true },
    });
  }
}
