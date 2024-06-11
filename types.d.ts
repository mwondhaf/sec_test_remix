export type Company = {
  readonly id: string;
  name: string;
  workScope: string;
  trade_license_number: string;
};

export type Entity = {
  readonly id: string;
  name: string;
  code: string;
  makani: string;
};

export type Profile = {
  readonly id: string;
  name: string;
  email: string;
  isActive: boolean;
};
