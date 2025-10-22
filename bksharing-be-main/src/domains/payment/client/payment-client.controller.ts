import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'src/domains/auth/auth-jwt.guard';
import { Roles } from 'src/domains/auth/auth-role.decorator';
import { AuthRoleGuard } from 'src/domains/auth/auth-role.guard';
import { AuthRequestDTO } from 'src/domains/auth/dto/auth-request.dto';
import { ReturnQueryFromVNPay } from 'src/services/payment-gateway/vn-pay/shared/vnpay.type';
import { BaseResponse } from 'src/shared/generics/base.response';
import { PaymentCreateREQ } from '../dto/payment-create.request';
import { PaymentClientService } from './payment-client.service';

@Controller('client/payments')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.STUDENT, AccountType.MENTOR)
export class PaymentClientController {
  constructor(private readonly paymentClientService: PaymentClientService) {}

  @Post()
  async createPayment(@Req() req: AuthRequestDTO, @Body() body: PaymentCreateREQ): Promise<any> {
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const payment = await this.paymentClientService.create(body, ipAddr as string);

    return BaseResponse.of(payment);
  }

  @Post('verify')
  async verify(@Body() body: ReturnQueryFromVNPay & { paymentId: number }): Promise<any> {
    const { paymentId, ...returnUrl } = body;
    const result = await this.paymentClientService.verify(paymentId, returnUrl);

    return BaseResponse.of(result);
  }
}
