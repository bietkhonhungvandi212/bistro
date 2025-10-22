import { HashAlgorithm, ProductCode, VnpCardType, VnpCurrCode, VnpLocale } from './vnpay.enum';

export const VNPAY_MODULE_OPTIONS = Symbol('VNPAY_MODULE_OPTIONS');

export type VnpMode = 'sandbox' | 'production';

export type VpnGlobalConfig = Omit<VNPayConfig, 'testMode' | 'enableLog' | 'loggerFn'> & {
  vnpayHost: string;
  vnp_Locale: VnpLocale;
  vnp_CurrCode: VnpCurrCode;
  vnp_Command: string;
  vnp_OrderType: ProductCode | string;
  vnp_Version: string;
};

export type DefaultConfig = Pick<VpnGlobalConfig, 'vnp_Version' | 'vnp_CurrCode' | 'vnp_Command' | 'vnp_OrderType'> & {
  vnp_TmnCode: string;
  vnp_Locale: VnpLocale;
};
export type VNPayConfig = {
  /**
   * Merchant tmn code
   */
  tmnCode: string;
  /**
   * Secure secret of merchant
   */
  secureSecret: string;
  /**
   * Version of VNPay API
   */
  vnp_Version?: string;
  /**
   * Currency code
   */
  vnp_CurrCode?: VnpCurrCode;
  /**
   * Language display on payment gateway
   */
  vnp_Locale?: VnpLocale;
  /**
   * API host url of VNPay
   * @default 'https://sandbox.vnpayment.vn'
   * @example 'https://sandbox.vnpayment.vn'
   */
  vnpayHost?: string;
  /**
   *  Payment endpoint of VNPay
   * @default 'paymentv2/vpcpay.html'
   * @example 'paymentv2/vpcpay.html'
   */
  paymentEndpoint?: string;
  /**
   * When using test mode, `vnpayHost` should be set to sandbox
   * @default false
   */
  mode?: VnpMode;
  /**
   * Hash algorithm
   * @default 'SHA512'
   */
  hashAlgorithm?: HashAlgorithm;
  /**
   * Disable it, then no logger will be used in any method
   *
   * Enable logging feature
   * @default false
   */
  enableLog?: boolean;
  /**
   * Method that allows you to customize the log
   * @param data Data to log, it can be change to each method
   * @returns
   */
  loggerFn?: (data: unknown) => void;
};

export type VNPayBuildUrlRequest = {
  /**
   * Amount of payment. Automatically calculated according to the unit of VNPay. (100 times the amount of the order in your database)
   */
  vnp_Amount: number;

  /**
   * Description of payment (Vietnamese, no accent)
   * @example Thanh toan don hang 12345
   */
  vnp_OrderInfo: string;

  /**
   * Reference code of transaction on merchant system. This code is unique to distinguish orders sent to VNPAY. Not duplicated in a day.
   * @example 123456
   */
  vnp_TxnRef: string;

  /**
   * IP address of customer who make transaction
   * @example 13.160.92.202
   */
  vnp_IpAddr: string;

  /**
   * URL thông báo kết quả giao dịch khi Khách hàng kết thúc thanh toán.
   * URL to notify result of transaction when customer finish payment
   * @example https://domain.vn/VnPayReturn
   */
  vnp_ReturnUrl: string;

  /**
   * Transaction date format yyyyMMddHHmmss(Time zone GMT+7)
   *
   * If `vnp_CreateDate` is not in the correct format, it will be the current time
   * @example 20170829103111
   * @example
   * ```ts
   *  import { dateFormat } from 'vnpay';
   *
   *  // then
   *  vnp_CreateDate: dateFormat(new Date()),
   * ```
   */
  vnp_CreateDate?: number;

  /**
   * Time of expiration of payment, format yyyyMMddHHmmss(Time zone GMT+7)
   * @example 20170829103111
   * @example
   * ```ts
   *  import { dateFormat } from 'vnpay';
   *
   *  const tomorrow = new Date();
   *  tomorrow.setDate(tomorrow.getDate() + 1);
   *
   *  // then
   *  vnp_CreateDate: dateFormat(tomorrow),
   * ```
   */
  vnp_ExpireDate?: number;

  /**
   * Currency code using for payment. Currently only support VND
   * @example VND
   */
  vnp_CurrCode?: VpnGlobalConfig['vnp_CurrCode'];

  /**
   * Language display on payment gateway. Currently support Vietnamese (vn), English)
   * @example vn
   */
  vnp_Locale?: VpnGlobalConfig['vnp_Locale'];

  /**
   * Order type/ Product Code
   * @default 'other'
   */
  vnp_OrderType?: VpnGlobalConfig['vnp_OrderType'];

  /**
   * Bank code
   * @example NCB
   */
  vnp_BankCode?: string;
};

export type VnpayModuleOptions = VNPayConfig;

export type ReturnQueryFromVNPay = Pick<VNPayBuildUrlRequest, 'vnp_OrderInfo' | 'vnp_TxnRef'> & {
  /**
   * Payment amount
   */
  vnp_Amount: number | string;
  /**
   * Merchant tmn code
   */
  vnp_TmnCode?: string;
  /**
   * Bank code
   * @example NCB
   */
  vnp_BankCode?: string;
  /**
   * Transaction code at bank
   * @example NCB20170829152730
   */
  vnp_BankTranNo?: string;
  /**
   * Type of customer account/card used: `ATM`, `QRCODE`
   * @example ATM
   */
  vnp_CardType?: VnpCardType | string;
  /**
   * Payment time. Format: yyyyMMddHHmmss
   * @example 20170829152730
   */
  vnp_PayDate?: number | string;
  /**
   * Transaction code recorded in VNPAY system.
   * @example 20170829153052
   */
  vnp_TransactionNo?: number | string;
  /**
   * Response code of payment result. The response code 00 corresponds to the Successful result for all APIs.
   * @example 00
   * @see https://sandbox.vnpayment.vn/apis/docs/bang-ma-loi/
   */
  vnp_ResponseCode: number | string;
  /**
   *
   * Response code of payment result. Status of transaction at VNPAY payment gateway.
   *
   * -00: Payment transaction is successful at VNPAY
   *
   * -Other 00: Payment transaction is not successful at VNPAY
   *
   * @example 00
   * @see https://sandbox.vnpayment.vn/apis/docs/bang-ma-loi/
   */
  vnp_TransactionStatus?: number | string;
  /**
   * Security type code used to create checksum code. This code depends on the configuration of the merchant and the version of the api used.
   * The current version supports `SHA256`, `HMACSHA512`.
   * @example HMACSHA512
   */
  vnp_SecureHashType?: string;
  /**
   * Checksum to ensure that the transaction data is not changed during the transfer from merchant to VNPAY.
   * The creation of this code depends on the configuration of the merchant and the version of the api used. The current version supports `SHA256`, `HMACSHA512`.
   *
   */
  vnp_SecureHash?: string;
};
