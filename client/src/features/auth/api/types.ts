export type AuthTokenResponse = {
  access_token: string;
  token_type: string;
};

export type UserPublic = {
  id: string;
  email: string;
};
