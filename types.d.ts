export type Company = {
  readonly id: string;
  name: string;
  workScope: string;
  trade_license_number: string;
};

export type Entity = {
  readonly id: number;
  name: string;
  code: string;
  makani: string;
};

export type Profile = {
  readonly id: string;
  name: string;
  email: string;
  isActive: boolean;
  role: "BASIC" | "ADMIN";
  idNumber: string;
  entityId: number;
  entities: Entity;
  employeeType: "INHOUSE" | "OTHER" | "CONTRACTOR";
};

export type Incident = {
  readonly id: number;
  title: string;
  description: string;
  incident_time: string;
  status: "OPEN" | "CLOSED";
  createdBy: Profile;
  createdDate: string;
  updatedDate: string;
};

export type IncidentType = {
  readonly id: number;
  name: string;
};

export type IncidentCategory = {
  readonly id: number;
  name: string;
  incident_type_id: number;
};

export type Department = {
  readonly id: number;
  name: string;
};
