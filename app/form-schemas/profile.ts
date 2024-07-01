import * as zod from "zod";

enum EmployeeType {
  INHOUSE = "INHOUSE",
  CONTRACTOR = "CONTRACTOR",
  OTHER = "OTHER",
}

enum Role {
  BASIC = "BASIC",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  SUPERVISOR = "SUPERVISOR",
}

export const profileSchema = zod.object({
  id: zod.string().uuid().optional(),
  name: zod.string().min(1),
  email: zod.string().email().optional(),
  entityId: zod.coerce.number().optional(),
  idNumber: zod.string().min(1),
  companyId: zod.string().or(zod.number()),
  // .transform((value) => (value === null ? 0 : Number(value))),
  createdAt: zod.string().optional(),
  updatedAt: zod.string().optional(),
  employeeType: zod.nativeEnum(EmployeeType).optional(),
  shift_start: zod.string().optional(),
  shift_end: zod.string().optional(),
  isActive: zod.boolean().optional(),
  role: zod.nativeEnum(Role).optional(),
});
