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
  email?: string;
};

export type Profile = {
  readonly id: string;
  name: string;
  email: string;
  isActive: boolean;
  role: "BASIC" | "ADMIN";
  idNumber: string;
  entityId: number;
  entity: Entity;
  entities?: Pick<Entity, "name", "id">;
  employeeType: "INHOUSE" | "OTHER" | "CONTRACTOR";
  company?: Pick<Company, "name">;
  shift_start?: string;
  shift_end?: string;
  companyId?: string;
};

export type RequestorProfile = {
  readonly id: number;
  full_name: string;
  email: string;
  isActive: boolean;
  role: "BASIC" | "ADMIN";
  id_number: string;
  entity_id: number;
  department_id: number;
  department: Department;
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
  category?: Pick<IncidentCategory, "name">;
  reporter_department?: Department;
  compiler?: Profile;
  editor?: Profile;
  people_involved?: PersonInvolved[];
  is_resolved: boolean;
  incident_type_id: Pick<IncidentCategory, "incident_type_id">;
  created_at: string;
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

enum RequestStatus {
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "ONGOING",
  "COMPLETED",
}

export type CCTVRequest = {
  readonly id: number;
  reason: string;
  location: string;
  from_time: string;
  to_time: string;
  created_at: string;
  status: RequestStatus;
  requestor: RequestorProfile;
  request_id: string;
  details: string;
  events_log?: EventLog[];
  replies?: CCTVReply[];
};

export type EventLog = {
  readonly id: number;
  event: string;
  created_at: string;
  event_by: string;
  remarks: string | null;
  cctv_ref?: number;
};

export type CCTVReply = {
  readonly id: number;
  content: string;
  created_at: string;
  cctv_request: number;
  reply_by: string;
};
