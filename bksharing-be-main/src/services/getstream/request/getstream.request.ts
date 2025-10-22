export interface GetstreamREQ {
  user_id: string;
  role?: string;
  call_cids: string[];
  validity_in_seconds?: number;
  exp?: number;
  iat?: number;
}
