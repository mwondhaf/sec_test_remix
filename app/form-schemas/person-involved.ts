import * as zod from "zod";
import { departmentSchema } from "./department";

export const personInvolvedSchema = zod.object({
  id: zod.number().optional(),
  created_at: zod.string().optional(),
  name: zod.string().min(1),
  nationality: zod.string().optional().nullable(),
  id_number: zod.string().optional(),
  person_dept: zod.number().min(1),
  incident_id: zod.number().min(1),
  remarks: zod.string().optional(),
  person_department: departmentSchema.optional(),
});
