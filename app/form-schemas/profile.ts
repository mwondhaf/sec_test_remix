import * as zod from "zod";

export const createProfileSchema = zod.object({
  name: zod.string().min(1),
  email: zod.string().email().optional(),
  idNumber: zod.string().min(1),
  companyId: zod.string().min(1),
  entityId: zod.string().min(1),
});
