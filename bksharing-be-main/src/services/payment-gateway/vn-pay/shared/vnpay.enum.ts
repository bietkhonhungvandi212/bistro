export enum HashAlgorithm {
  SHA256 = 'SHA256',
  SHA512 = 'SHA512',
  MD5 = 'MD5',
}

export enum VnpCurrCode {
  VND = 'VND',
}
export enum VnpLocale {
  VN = 'vn',
  EN = 'en',
}

export enum VnpCardType {
  ATM = 'ATM',
  QRCODE = 'QRCODE',
}

export enum BankCode {
  VNPAYQR = 'VNPAYQR',
  VNBANK = 'VNBANK',
  INTCARD = 'INTCARD',
}
export declare enum VnpTransactionType {
  PAYMENT = '01',
  FULL_REFUND = '02',
  PARTIAL_REFUND = '03',
}

export declare enum RefundTransactionType {
  FULL_REFUND = '02',
  PARTIAL_REFUND = '03',
}

/**
 * @see https://sandbox.vnpayment.vn/apis/docs/loai-hang-hoa/
 */
export enum ProductCode {
  Food_Consumption = '100000',
  Phone_Tablet = '110000',
  ElectricAppliance = '120000',
  Computers_OfficeEquipment = '130000',
  Electronics_Sound = '140000',
  Books_Newspapers_Magazines = '150000',
  Sports_Picnics = '160000',
  Hotel_Tourism = '170000',
  Cuisine = '180000',
  Entertainment_Training = '190000',
  Fashion = '200000',
  Health_Beauty = '210000',
  Mother_Baby = '220000',
  KitchenUtensils = '230000',
  Vehicle = '240000',
  Pay = '250000',
  AirlineTickets = '250007',
  CardCode = '260000',
  Pharmacy_MedicalServices = '270000',
  Other = 'other',
}
