import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { AccountStatus } from '@prisma/client';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { AccountErrorMessages } from 'src/shared/messages/error-messages';
import { AuthUserDTO } from '../auth/dto/auth-user.dto';
import { ImageService } from '../image/image.service';
import { AccountChangePasswordDTO } from './dto/account-change-password.dto';
import { AccountCreateDTO } from './dto/account-create.dto';
import { AccountUpdateDTO } from './dto/account-update.dto';

@Injectable()
export class AccountService {
  private readonly HASH_ROUND = 10;
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly imageService: ImageService,
  ) {}

  async getMe(accountId: number) {
    const account = await this.transactionHost.tx.account.findUnique({
      where: { id: accountId },
      select: {
        id: true,
        name: true,
        email: true,
        gender: true,
        phoneNumber: true,
        dob: true,
        accountType: true,
        addressBase: true,
        addressDetail: true,
        avatarId: true,
      },
    });

    const thumbnail = await this.imageService.getImageOriginal(account.avatarId);

    return { account, thumbnail };
  }

  async createAccount(body: AccountCreateDTO) {
    const account = await this.transactionHost.tx.account.create({
      data: {
        name: body.name,
        gender: body.gender,
        email: body.email,
        dob: body.dob,
        bio: body.bio,
        password: this.hashPassword(body.password),
        phoneNumber: body.phoneNumber,
        accountType: body.accountType,
        addressBase: body.addressBase,
        addressDetail: body.addressDetail,
        status: AccountStatus.INACTIVE,
      },
      select: { id: true, avatarId: true, name: true, email: true, accountType: true, status: true },
    });

    return account;
  }

  async updateAccount(user: AuthUserDTO, body: AccountUpdateDTO) {
    const account = await this.transactionHost.tx.account.findUnique({
      where: { id: user.accountId },
      select: { id: true },
    });

    if (!account) throw new ActionFailedException(ActionFailed.ACCOUNT_NOT_FOUND, AccountErrorMessages.MSG01);

    if (body.avatarId) {
      await this.imageService.linkImageToAccount(user.accountId, body.avatarId);
    }

    if (body.email) {
      const existedAccount = await this.transactionHost.tx.account.findFirst({
        where: { email: body.email, id: { not: user.accountId } },
        select: { id: true },
      });

      if (existedAccount) {
        throw new ActionFailedException(ActionFailed.ACCOUNT_EMAIL_EXISTED, AccountErrorMessages.MSG02);
      }
    }

    if (body.phoneNumber) {
      const existedAccount = await this.transactionHost.tx.account.findFirst({
        where: { phoneNumber: body.phoneNumber, id: { not: user.accountId } },
        select: { id: true },
      });

      if (existedAccount) {
        throw new ActionFailedException(ActionFailed.ACCOUNT_PHONE_NUMBER_EXISTED, AccountErrorMessages.MSG03);
      }
    }

    return await this.transactionHost.tx.account.update(AccountUpdateDTO.toUpdate(user, body));
  }

  async changePassword(accountId: number, body: AccountChangePasswordDTO) {
    await this.checkCurrentPassword(accountId, body.currentPassword);

    return await this.transactionHost.tx.account.update({
      where: { id: accountId },
      data: { password: this.hashPassword(body.newPassword) },
      select: { id: true },
    });
  }

  async resetPassword(accountId: number, password: string) {
    return await this.transactionHost.tx.account.update({
      where: { id: accountId },
      data: { password: this.hashPassword(password) },
      select: { id: true },
    });
  }

  async checkCurrentPassword(id: number, currentPassword: string) {
    const account = await this.transactionHost.tx.account.findUniqueOrThrow({
      where: { id: id },
      select: { password: true },
    });

    const isMatch = this.verifyPassword(currentPassword, account.password);
    if (!isMatch) {
      throw new ActionFailedException(ActionFailed.INCORRECT_PASSWORD, AccountErrorMessages.MSG04);
    }
  }

  hashPassword(password: string) {
    return bcrypt.hashSync(password, this.HASH_ROUND);
  }

  verifyPassword(password: string, savedPassword: string) {
    return bcrypt.compareSync(password, savedPassword);
  }
}
