import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AccountService } from 'src/domains/accounts/account.service';
import { AccountChangePasswordDTO } from 'src/domains/accounts/dto/account-change-password.dto';
import { AccountUpdateDTO } from 'src/domains/accounts/dto/account-update.dto';
import { AccountRESP } from 'src/domains/accounts/response/account.response';
import { AuthRequestDTO } from 'src/domains/auth/dto/auth-request.dto';
import { BaseResponse } from 'src/shared/generics/base.response';
import { AuthJwtGuard } from '../auth/auth-jwt.guard';

@Controller('accounts')
@UseGuards(AuthJwtGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('me')
  async get(@Req() req: AuthRequestDTO) {
    const { account, thumbnail } = await this.accountService.getMe(req.user.accountId);

    return BaseResponse.of(
      AccountRESP.fromEntity(
        {
          ...account,
          dob: String(account.dob),
        },
        thumbnail,
      ),
    );
  }

  @Patch('me')
  async update(@Req() req: AuthRequestDTO, @Body() body: AccountUpdateDTO) {
    const response = await this.accountService.updateAccount(req.user, body);
    return BaseResponse.of(response.id);
  }

  @Post('change-password')
  async changePassword(@Req() req: AuthRequestDTO, @Body() body: AccountChangePasswordDTO) {
    const response = await this.accountService.changePassword(req.user.accountId, body);

    return BaseResponse.of(response);
  }
}
