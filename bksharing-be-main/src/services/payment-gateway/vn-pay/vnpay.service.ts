import { Inject, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { isNull } from 'lodash';
import { VNP_HASHSECRET, VNP_TMNCODE, VNP_VERSION, VNPAY_SANDBOX_HOST } from 'src/app.config';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { numberRegex } from 'src/shared/constants/common.constant';
import { DATE_FORMAT } from 'src/shared/constants/date.constant';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { Result, SuccessOrFailResponse } from 'src/shared/generics/type.helper';
import { makeResult } from 'src/shared/helpers/common.helper';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { leanObject } from 'src/shared/parsers/common.parser';
import { parseDateTimeNowFormat } from 'src/shared/parsers/datetime.parse';
import { VNP_DEFAULT_COMMAND, VNP_DEFAULT_CURR_CODE } from './shared/vnpay.constant';
import { HashAlgorithm, ProductCode, VnpCurrCode, VnpLocale } from './shared/vnpay.enum';
import {
  buildPaymentUrlSearchParams,
  calculateSecureHash,
  createPaymentUrl,
  generateExpiredDate,
  isValidVnpayDateFormat,
  makeVNPayResponse,
  verifySecureHash,
} from './shared/vnpay.helper';
import {
  DefaultConfig,
  ReturnQueryFromVNPay,
  VNPAY_MODULE_OPTIONS,
  VNPayBuildUrlRequest,
  VNPayConfig,
  VpnGlobalConfig,
} from './shared/vnpay.type';

@Injectable()
export class VnpayService {
  private readonly logger = new Logger(VnpayService.name);
  private HASH_ALGORITHM = HashAlgorithm.SHA512;
  private BUFFER_ENCODE: BufferEncoding = 'utf-8';
  private readonly globalDefaultConfig: VpnGlobalConfig;

  constructor(
    @Inject(VNPAY_MODULE_OPTIONS) private readonly config: VNPayConfig,
    private readonly transactionHost: TransactionHost,
  ) {
    if (isNull(this.config.mode) || this.config.mode === 'sandbox') {
      this.globalDefaultConfig.vnpayHost = VNPAY_SANDBOX_HOST;
    }

    this.globalDefaultConfig = {
      tmnCode: VNP_TMNCODE,
      vnp_Version: VNP_VERSION,
      vnpayHost: VNPAY_SANDBOX_HOST,
      secureSecret: VNP_HASHSECRET,
      vnp_Command: VNP_DEFAULT_COMMAND,
      vnp_CurrCode: VNP_DEFAULT_CURR_CODE as VnpCurrCode,
      vnp_Locale: VnpLocale.VN,
      vnp_OrderType: ProductCode.Other,
      ...config,
    };
  }

  /**
   */
  @Transactional(TRANSACTION_TIMEOUT)
  async create(paymentId: number, body: VNPayBuildUrlRequest) {
    const url = this.buildPaymentUrl(body);
    const searchParams = url
      .split('?')[1]
      .split('&')
      .reduce((acc, item) => {
        const [key, value] = item.split('=');
        return { ...acc, [key]: value };
      }, {}) as VNPayBuildUrlRequest;
    console.log('🚀 ~ VnpayService ~ create ~ searchParams:', searchParams);

    const { vnp_TxnRef, vnp_CreateDate, vnp_Amount, vnp_BankCode, vnp_OrderInfo, ...remain } = searchParams;

    await this.transactionHost.tx.vnpayProvider.upsert({
      where: { paymentId },
      update: {
        vnp_Amount: vnp_Amount,
        vnp_BankCode: vnp_BankCode,
        vnp_OrderInfo: vnp_OrderInfo,
        vnp_CreatedDate: vnp_CreateDate,
        vnp_TxnRef: vnp_TxnRef,
        metadata: remain,
      },
      create: {
        vnp_Amount: vnp_Amount,
        vnp_BankCode: vnp_BankCode,
        vnp_OrderInfo: vnp_OrderInfo,
        vnp_CreatedDate: vnp_CreateDate,
        vnp_TxnRef: vnp_TxnRef,
        metadata: remain,
        Payment: connectRelation(paymentId),
      },
    });

    return url;
  }

  /**
   * Lấy cấu hình mặc định của VNPay
   * @en Get default config of VNPay
   */
  public get defaultConfig(): DefaultConfig {
    return {
      vnp_TmnCode: this.globalDefaultConfig.tmnCode,
      vnp_Version: this.globalDefaultConfig.vnp_Version,
      vnp_CurrCode: this.globalDefaultConfig.vnp_CurrCode,
      vnp_Locale: this.globalDefaultConfig.vnp_Locale,
      vnp_Command: this.globalDefaultConfig.vnp_Command,
      vnp_OrderType: this.globalDefaultConfig.vnp_OrderType,
    };
  }

  async getBankList(): Promise<Result<any, AxiosError>> {
    return makeResult(async () => {});
  }

  /**
   * Phương thức xây dựng, tạo thành url thanh toán của VNPay
   * @en Build the payment url
   *
   * @param {BuildPaymentUrl} data - Payload that contains the information to build the payment url
   * @returns {string} The payment url string
   * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#tao-url-thanh-toan
   */
  public buildPaymentUrl(data: VNPayBuildUrlRequest): string {
    const createDate = Number(parseDateTimeNowFormat(DATE_FORMAT.DATE_TIME_SECOND.NO_SPACE));

    if (data?.vnp_ExpireDate && !isValidVnpayDateFormat(data.vnp_ExpireDate)) {
      // Because the URL still works without vnp_ExpireDate, we keep it optional here.
      // TODO: make it required when VNPAY's `vnp_ExpireDate` is required
      throw new Error('Invalid vnp_ExpireDate format. use `formatDate` utility function to format it');
    }

    const expiredDate = data.vnp_ExpireDate || generateExpiredDate(Number(createDate));

    const dataToBuild = leanObject({
      ...this.defaultConfig,
      ...data,

      /**
       * Multiply by 100 to follow VNPay standard, see docs for more detail
       */
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expiredDate,
      vnp_Amount: data.vnp_Amount * 100,
    });

    const redirectUrl = createPaymentUrl({
      config: this.globalDefaultConfig,
      data: dataToBuild,
    });

    const signed = calculateSecureHash({
      secureSecret: this.globalDefaultConfig.secureSecret,
      data: redirectUrl.search.slice(1).toString(),
      hashAlgorithm: this.HASH_ALGORITHM,
      bufferEncode: this.BUFFER_ENCODE,
    });
    console.log('🚀 ~ VnpayService ~ buildPaymentUrl ~ signed:', signed);

    redirectUrl.searchParams.append('vnp_SecureHash', signed);

    return redirectUrl.toString();
  }

  public async verifyReturnUrl(
    paymentId: number,
    query: ReturnQueryFromVNPay,
  ): Promise<Result<{ message: string } & ReturnQueryFromVNPay, Error>> {
    const { vnp_SecureHash, vnp_SecureHashType, ...cloneQuery } = query;

    if (typeof cloneQuery?.vnp_Amount !== 'number') {
      const isValidAmount = numberRegex.test(cloneQuery?.vnp_Amount ?? '');
      if (!isValidAmount) {
        return SuccessOrFailResponse.Failure(new Error('Invalid vnp_Amount format'));
      }
      cloneQuery.vnp_Amount = Number(cloneQuery.vnp_Amount);
    }

    const searchParams = buildPaymentUrlSearchParams(cloneQuery);
    this.logger.log('🚀 ~ VnpayService ~ searchParams:', searchParams);
    const isVerified = verifySecureHash({
      secureSecret: this.globalDefaultConfig.secureSecret,
      data: searchParams.toString(),
      hashAlgorithm: this.HASH_ALGORITHM,
      receivedHash: vnp_SecureHash,
    });

    if (!isVerified) this.logger.warn(`🚀 ~ VnpayService ~ isVerified ~ Payment with id ${paymentId} has been unverified`);

    const message = makeVNPayResponse(cloneQuery.vnp_ResponseCode?.toString() ?? '', this.globalDefaultConfig.vnp_Locale);
    this.logger.log('🚀 ~ VnpayService ~ message:', message);

    await this.updatePaymentAfterVerify(paymentId, cloneQuery);

    return isVerified
      ? SuccessOrFailResponse.Success({
          ...cloneQuery,
          vnp_Amount: cloneQuery.vnp_Amount / 100,
          message,
        })
      : SuccessOrFailResponse.Failure(new Error("The payment is unverified. It's not safe to continue"));
  }

  async updatePaymentAfterVerify(paymentId: number, cloneQuery: ReturnQueryFromVNPay) {
    await this.transactionHost.tx.vnpayProvider.update({
      where: { paymentId },
      data: {
        vnp_PayDate: Number(cloneQuery.vnp_PayDate),
        vnp_TransactionStatus: cloneQuery.vnp_TransactionStatus as string,
        vnp_TransactionNo: cloneQuery.vnp_TransactionNo as string,
        metadata: cloneQuery,
      },
    });
  }
}
