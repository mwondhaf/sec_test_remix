import * as zod from "zod";

enum EmployeeType {
  INHOUSE = "INHOUSE",
  CONTRACTOR = "CONTRACTOR",
  OTHER = "OTHER",
}

export const createProfileSchema = zod.object({
  id: zod.string().uuid().optional(),
  name: zod.string().min(1),
  email: zod.string().email().optional(),
  entityId: zod.number().min(1),
  idNumber: zod.string().min(1),
  companyId: zod.string().min(1),
  createdAt: zod.string().optional(),
  updatedAt: zod.string().optional(),
  employeeType: zod.nativeEnum(EmployeeType),
});
