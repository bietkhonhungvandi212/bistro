import crypto, { type BinaryLike } from 'crypto';
import { VNPAY_ENDPOINT, VNPAY_SANDBOX_HOST } from 'src/app.config';
import { DATE_FORMAT } from 'src/shared/constants/date.constant';
import { resolveUrlString } from 'src/shared/helpers/common.helper';
import { parseAndAddMinutes } from 'src/shared/parsers/datetime.parse';
import { VNPAY_RESPONSE_MAP } from './vnpay.constant';
import { HashAlgorithm, VnpLocale } from './vnpay.enum';
import { DefaultConfig, VNPayBuildUrlRequest, VpnGlobalConfig } from './vnpay.type';

/**
 * Validate if the date is match with format `yyyyMMddHHmmss` or not
 * @param date The date to be validated
 * @returns True if the date is valid, false otherwise
 */
export function isValidVnpayDateFormat(date: number): boolean {
  const dateString = date.toString();
  const regex = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])([01][0-9]|2[0-3])[0-5][0-9][0-5][0-9]$/;
  return regex.test(dateString);
}
export function formatVnpayDate(date: Date, format = 'yyyyMMddHHmmss'): number {
  const pad = (n: number) => (n < 10 ? `0${n}` : n).toString();
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  return Number(
    format
      .replace('yyyy', year.toString())
      .replace('MM', month)
      .replace('dd', day)
      .replace('HH', hour)
      .replace('mm', minute)
      .replace('ss', second),
  );
}

export function generateExpiredDate(createdDate: number): number {
  if (!isValidVnpayDateFormat(createdDate)) {
    throw new Error('Invalid date format');
  }

  //generate expired date after 10 minutes
  const expiredDate = parseAndAddMinutes(createdDate.toString(), 10, DATE_FORMAT.DATE_TIME_SECOND.NO_SPACE);
  return Number(expiredDate);
}

export function buildPaymentUrlSearchParams(data: Record<string, unknown>): URLSearchParams {
  const searchParams = new URLSearchParams();
  const sortedEntries = Object.entries(data).sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()));

  for (const [key, value] of sortedEntries) {
    // Skip empty value
    if (value === '' || value === undefined || value === null) {
      continue;
    }

    searchParams.append(key, value.toString());
  }
  return searchParams;
}

export const createPaymentUrl = ({
  data,
  config,
}: {
  data: (VNPayBuildUrlRequest & DefaultConfig) | Record<string, unknown>;
  config: Pick<VpnGlobalConfig, 'vnpayHost' | 'paymentEndpoint'>;
}): URL => {
  const redirectUrl = new URL(resolveUrlString(config.vnpayHost ?? VNPAY_SANDBOX_HOST, config.paymentEndpoint ?? VNPAY_ENDPOINT));

  buildPaymentUrlSearchParams(data).forEach((value, key) => {
    redirectUrl.searchParams.set(key, value);
  });

  return redirectUrl;
};

export function calculateSecureHash({
  bufferEncode = 'utf-8',
  data,
  hashAlgorithm,
  secureSecret,
}: {
  secureSecret: string;
  data: string;
  hashAlgorithm: HashAlgorithm;
  bufferEncode?: BufferEncoding;
}): string {
  return hashVnpay(secureSecret, Buffer.from(data, bufferEncode), hashAlgorithm);
}

export function verifySecureHash({
  data,
  hashAlgorithm,
  receivedHash,
  secureSecret,
}: {
  secureSecret: string;
  data: string;
  hashAlgorithm: HashAlgorithm;
  receivedHash: string;
}): boolean {
  const calculatedHash = calculateSecureHash({ secureSecret, data, hashAlgorithm });
  console.log('🚀 ~ calculatedHash:', calculatedHash);
  return calculatedHash === receivedHash;
}

export function hashVnpay(secret: string, data: BinaryLike, algorithm: HashAlgorithm): string {
  return crypto.createHmac(algorithm, secret).update(data).digest('hex');
}

export function makeVNPayResponse(responseCode: string = '', locale: string = VnpLocale.VN) {
  const responseText: Record<VnpLocale, string> = VNPAY_RESPONSE_MAP.get(responseCode) ?? VNPAY_RESPONSE_MAP.get('default');

  return responseText[locale];
}
