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

enum Severity {
  "Low",
  "Medium",
  "High",
}

export type Incident = {
  readonly id: number;
  description: string;
  incident_time: string;
  incident_close_time: string;
  severity: Severity;
  incident_location: string;
  category_id: number;
  reporter_dept: string;
  reporter_name: string;
  action: string;
  updated_at: string;
  category?: IncidentCategory;
  reporter_department?: Department;
  compiler?: Profile;
  editor?: Profile;
  people_involved?: PersonInvolved[];
};

export type PersonInvolved = {
  readonly id: number;
  name: string;
  id_number: string;
  nationality: string;
  incident_id: number;
  person_department: Pick<Department, "name">;
  remarks: string;
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
