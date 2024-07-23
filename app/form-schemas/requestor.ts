import * as zod from "zod";

enum Role {
  BASIC = "BASIC",
  MANAGER = "MANAGER",
  SUPERVISOR = "SUPERVISOR",
}

export const requestorProfileSchema = zod.object({
  id: zod.number().optional(),
  full_name: zod.string().min(1),
  email: zod.string().email().optional(),
  entity_id: zod.coerce.number().optional(),
  department_id: zod.coerce.number().optional(),
  id_number: zod.string().min(1),
  created_at: zod.string().optional(),
  isActive: zod.boolean().optional(),
  isApproved: zod.boolean().optional(),
  role: zod.nativeEnum(Role).optional(),
  remarks: zod.string().optional(),
  phone: zod.string().optional(),
});

enum cctvStatus {
  ONGOING = "ONGOING",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export const cctvSchema = zod.object({
  id: zod.number().optional(),
  from_time: zod.string(),
  to_time: zod.string(),
  reason: zod.string(),
  location: zod.string(),
  details: zod.string(),
  status: zod.nativeEnum(cctvStatus).optional(),
  results: zod.string().optional().optional(),
  requested_by: zod.coerce.number().optional(),
  accepted_by: zod.string().optional(),
  updated_by: zod.string().optional(),
  updated_at: zod.string().optional(),
  created_at: zod.string().optional(),
  request_id: zod.string().optional(),
  reply: zod.string().optional(),
});
