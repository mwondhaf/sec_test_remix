import * as zod from "zod";

enum EmployeeType {
  INHOUSE = "INHOUSE",
  CONTRACTOR = "CONTRACTOR",
  OTHER = "OTHER",
}

export const personInvolvedSchema = zod.object({
  id: zod.number().optional(),
  created_at: zod.string().optional(),
  name: zod.string().min(1),
  nationality: zod.string().optional(),
  id_number: zod.string().optional(),
  person_dept: zod.number().min(1),
  incident_id: zod.number().min(1),
  remarks: zod.string().optional(),
});
