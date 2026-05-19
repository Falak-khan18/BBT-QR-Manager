export type QrRecord = {
  id: string;
  short_code: string;
  title: string | null;
  destination_url: string;
  redirect_url: string;
  created_at: string;
  updated_at: string;
};

export type CreateQRPayload = {
  title?: string | null;
  destination_url: string;
};

export type UpdateQRPayload = {
  title?: string | null;
  destination_url?: string;
};
