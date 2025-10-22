import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { VNPAY_RETURN_URL } from 'src/app.config';
import { BankCode } from 'src/services/payment-gateway/vn-pay/shared/vnpay.enum';
import { VNPayBuildUrlRequest } from 'src/services/payment-gateway/vn-pay/shared/vnpay.type';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { nowEpoch } from 'src/shared/helpers/common.helper';
import { IdValidator } from 'src/shared/request-validator/id.validator';

export class PaymentCreateREQ {
  @IdValidator()
  subscriptionId: number;

  @IsNumber()
  @Min(COMMON_CONSTANT.ZERO_VALUE)
  amount: number;

  @IsEnum(BankCode)
  @IsOptional()
  bankCode?: BankCode;

  @IsString()
  @MaxLength(255)
  description: string;

  static toVnpayRequest(body: PaymentCreateREQ, ipAddr: string): VNPayBuildUrlRequest {
    return {
      vnp_Amount: body.amount,
      vnp_BankCode: body.bankCode,
      vnp_OrderInfo: body.description,
      vnp_IpAddr: ipAddr,
      vnp_ReturnUrl: VNPAY_RETURN_URL,
      vnp_TxnRef: `${body.subscriptionId}-${nowEpoch()}`,
    };
  }
}
